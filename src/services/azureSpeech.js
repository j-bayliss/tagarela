function extractPronunciationWords(jsonText) {
  try {
    const data = JSON.parse(jsonText || "{}");
    const words = data?.NBest?.[0]?.Words || [];
    return words.slice(0, 16).map((w) => ({
      word: w.Word || "",
      accuracy: Math.round(Number(w?.PronunciationAssessment?.AccuracyScore ?? 0)),
      errorType: w?.PronunciationAssessment?.ErrorType || "",
    })).filter((w) => w.word);
  } catch {
    return [];
  }
}

export async function recognizeOnceWithAzure(settings) {
  if (!settings?.key || !settings?.region) throw new Error("Add your Azure Speech key and region in settings first.");
  if (!window.isSecureContext && !location.hostname.includes("localhost")) {
    throw new Error("Microphone access needs HTTPS or localhost.");
  }
  const SpeechSDK = window.SpeechSDK;
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(settings.key, settings.region);
  speechConfig.speechRecognitionLanguage = "pt-BR";
  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        const text = result && result.reason === SpeechSDK.ResultReason.RecognizedSpeech ? (result.text || "") : "";
        recognizer.close();
        if (!text) { reject(new Error(result?.errorDetails || "I couldn't catch that — try again.")); return; }
        resolve(text);
      },
      (err) => { recognizer.close(); reject(new Error(String(err || "Azure Speech failed."))); },
    );
  });
}

export async function assessPronunciationWithAzure(referenceText, settings) {
  if (!settings?.key || !settings?.region) throw new Error("Add your Azure Speech key and region in settings first.");
  if (!window.isSecureContext && !location.hostname.includes("localhost")) {
    throw new Error("Microphone access needs HTTPS or localhost.");
  }

  const SpeechSDK = window.SpeechSDK;
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(settings.key, settings.region);
  speechConfig.speechRecognitionLanguage = "pt-BR";
  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
  const pronConfig = new SpeechSDK.PronunciationAssessmentConfig(
    referenceText,
    SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
    SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
    true,
  );
  try {
    pronConfig.phonemeAlphabet = "IPA";
    if (typeof pronConfig.enableProsodyAssessment === "function") pronConfig.enableProsodyAssessment();
  } catch {}
  pronConfig.applyTo(recognizer);

  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        try {
          if (result?.reason !== SpeechSDK.ResultReason.RecognizedSpeech) {
            const detail = result?.errorDetails || "I could not recognise that attempt. Try speaking clearly and close to the mic.";
            recognizer.close();
            reject(new Error(detail));
            return;
          }
          const pa = SpeechSDK.PronunciationAssessmentResult.fromResult(result);
          const json = result.properties.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult);
          recognizer.close();
          resolve({
            text: result.text || "",
            pronunciationScore: Math.round(Number(pa.pronunciationScore || 0)),
            accuracyScore: Math.round(Number(pa.accuracyScore || 0)),
            fluencyScore: Math.round(Number(pa.fluencyScore || 0)),
            completenessScore: Math.round(Number(pa.completenessScore || 0)),
            prosodyScore: Math.round(Number(pa.prosodyScore || 0)),
            words: extractPronunciationWords(json),
          });
        } catch (error) {
          recognizer.close();
          reject(error);
        }
      },
      (err) => {
        recognizer.close();
        reject(new Error(String(err || "Azure Speech failed.")));
      },
    );
  });
}

let activeSynth = null;
export async function synthesizeWithAzure(text, settings) {
  if (!settings?.key || !settings?.region) throw new Error("Azure Speech not configured.");
  const SpeechSDK = window.SpeechSDK;
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(settings.key, settings.region);
  speechConfig.speechSynthesisVoiceName = settings.voice || "pt-BR-FranciscaNeural";
  if (activeSynth) { try { activeSynth.close(); } catch {} activeSynth = null; }
  const synth = new SpeechSDK.SpeechSynthesizer(speechConfig);
  activeSynth = synth;
  return new Promise((resolve, reject) => {
    synth.speakTextAsync(
      text,
      (result) => {
        try { synth.close(); } catch {}
        if (activeSynth === synth) activeSynth = null;
        if (result && result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) resolve();
        else reject(new Error("Speech synthesis failed."));
      },
      (err) => {
        try { synth.close(); } catch {}
        if (activeSynth === synth) activeSynth = null;
        reject(new Error(String(err || "Speech synthesis failed.")));
      },
    );
  });
}
