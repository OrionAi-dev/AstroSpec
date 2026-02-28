import('@astrospec/integration-audio-openai')
  .then(m => {
    console.log('✅ workspace import ok', !!m.OpenAITranscriptionAdapter);
    if (!m.OpenAITranscriptionAdapter) process.exit(1);
  })
  .catch(e => {
    console.error('❌ workspace import failed');
    console.error(e);
    process.exit(1);
  });
