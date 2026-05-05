var bpm = 120;
var ChannelDefaultNoteLength = [4, 4, 4, 4];
var ChannelDefaultOctave = [4, 4, 4, 4];

// 1. Criando os instrumentos para cada canal
const canais = {
    ch1: new Tone.Synth().toDestination(),    // Melodia (Lead)
    ch2: new Tone.PolySynth().toDestination(),// Harmonia (Acordes)
    ch3: new Tone.MonoSynth().toDestination(),// Baixo (Bass - perfeito para você!)
    ch4: new Tone.NoiseSynth().toDestination()// Percussão (Ruído/Bateria)
};

async function iniciarPlayer() {
    var notaslidas = [];

    // Garante que o áudio seja liberado no browser
    await Tone.start();
    Tone.getTransport().bpm.value = document.getElementById('global-bpm').value;
    console.log("Audio Pronto!");

    // Pega os valores dos 4 textareas que você criou no HTML
    const mmlData = [
        document.getElementById('mml-ch1').value,
        document.getElementById('mml-ch2').value,
        document.getElementById('mml-ch3').value,
        document.getElementById('mml-ch4').value
    ];
    notaslidas = mmldataread(mmlData);
}

function CriarNota(valor, duracao) {
    return {
        nota: valor,
        duracao: duracao
    };
}

function mmldataread(mmlstringdata) {
    var notas = [[], [], [], []]; // Array para armazenar as notas de cada canal
    // var _temp_notas = CriarNota('', '');
    
    
    // Leitura de cada canal juntamente com todas as notas recebidas
    for (let channel of mmlstringdata) {
        let indexofChannel = mmlstringdata.indexOf(channel); // Índice do canal atual

        for (let i = 0; i < channel.length; i++) {
            var char = channel[i]; // Leitura do caracter do canal na posição j
            var next_char = channel[i + 1]; // Leitura do próximo caracter do canal na posição j+1

            if (/[o]/.test(char)) {
                ChannelDefaultOctave[indexofChannel] = parseInt(next_char); // Atualiza a oitava padrão do canal
                i++;
            }
            else if(/[<>]/.test(char)){
                if(char === '>') {
                    ChannelDefaultOctave[indexofChannel] += 1; // Aumenta a oitava padrão do canal
                }
                else {
                    ChannelDefaultOctave[indexofChannel] -= 1; // Diminui a oitava padrão do canal
                }
            }
            else if (/[a-gA-G]/.test(char)) {
                let _notadanota = char.toUpperCase(); // Cria a nota com a oitava padrão do canal

                if (/[#]/.test(next_char)) // É uma nota, mas a próxima é um sustenido
                {
                    _notadanota += '#'; // Adiciona o sustenido e passa para a próxima posição
                    i++;
                }
                _notadanota += ChannelDefaultOctave[indexofChannel]; // Adiciona a oitava na nota
                
                let _temp_duracaodanota = ""; // Duração padrão da nota

                while(/[0-9]/.test(channel[i + 1])){
                    _temp_duracaodanota += channel[++i];
                }

                let _duracaodanota = _temp_duracaodanota != ""
                ? _temp_duracaodanota + "n"
                : ChannelDefaultNoteLength[indexofChannel] + "n";

                notas[indexofChannel].push(CriarNota(_notadanota, _duracaodanota)); // Adiciona a nota ao array do canal
            }
            // console.log(notas[0]);
        }
    }
    return notas;
} // Fim da função de leitura do MML

// Event Listeners
document.getElementById('play-btn').addEventListener('click', iniciarPlayer);
document.getElementById('stop-btn').addEventListener('click', () => {
    Tone.Transport.stop();
    // Silencia todos os canais imediatamente
    Object.values(canais).forEach(synth => synth.releaseAll ? synth.releaseAll() : null);
});