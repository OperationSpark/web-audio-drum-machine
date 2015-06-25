(function () {
    window.opspark = window.opspark || {};

    window.opspark.makeApp = function (updateable) {
        var
            _app,
            audioContext;

        audioContext = new AudioContext();

        _app = {


            createKick: function () {

                var _k = {};
                _k.context = audioContext;

                _k.setup = function() {
                    _k.osc = _k.context.createOscillator();
                    _k.gain = _k.context.createGain();
                    _k.osc.connect(_k.gain);
                    _k.gain.connect(_k.context.destination)
                };

                _k.trigger = function(time) {
                    _k.setup();

                    _k.osc.frequency.setValueAtTime(150, time);
                    _k.gain.gain.setValueAtTime(1, time);

                    _k.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
                    _k.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

                    _k.osc.start(time);

                    _k.osc.stop(time + 0.5);
                };

                return _k;
            },

            createSnare: function () {
                var _s = {};

                _s.context = audioContext;

                _s.noiseBuffer = function() {
                    var bufferSize = _s.context.sampleRate;
                    var buffer = _s.context.createBuffer(1, bufferSize, _s.context.sampleRate);
                    var output = buffer.getChannelData(0);

                    for (var i = 0; i < bufferSize; i++) {
                        output[i] = Math.random() * 2 - 1;
                    }

                    return buffer;
                },

                _s.setup = function() {
                    _s.noise = _s.context.createBufferSource();
                    _s.noise.buffer = _s.noiseBuffer();
                    var noiseFilter = _s.context.createBiquadFilter();
                    noiseFilter.type = 'highpass';
                    noiseFilter.frequency.value = 1000;
                    _s.noise.connect(noiseFilter);

                    _s.noiseEnvelope = _s.context.createGain();
                    noiseFilter.connect(_s.noiseEnvelope);

                    _s.noiseEnvelope.connect(_s.context.destination);

                    _s.osc = _s.context.createOscillator();
                    _s.osc.type = 'triangle';

                    _s.oscEnvelope = _s.context.createGain();
                    _s.osc.connect(_s.oscEnvelope);
                    _s.oscEnvelope.connect(_s.context.destination);
                };

                _s.trigger = function (time) {
                    _s.setup();

                    _s.noiseEnvelope.gain.setValueAtTime(1, time);
                    _s.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
                    _s.noise.start(time)

                    _s.osc.frequency.setValueAtTime(100, time);
                    _s.oscEnvelope.gain.setValueAtTime(0.7, time);
                    _s.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
                    _s.osc.start(time)

                    _s.osc.stop(time + 0.2);
                    _s.noise.stop(time + 0.2);
                };

                return _s;
            },

            createHiHat: function (buffer) {
                var _h = {};

                _h.context = audioContext;
                _h.buffer = buffer;

                _h.setup = function () {
                    _h.source = _h.context.createBufferSource();
                    _h.source.buffer = _h.buffer;
                    _h.source.connect(_h.context.destination);
                };

                _h.trigger = function (time) {
                    _h.setup();
                    _h.source.start(time);
                };

                return _h;
            },

            getCurrentTime: function () {
                return audioContext.currentTime;
            },
        };

        return _app;
    };
})();
