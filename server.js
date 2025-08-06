
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const PORT = 3002;


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 


app.use(express.static('public'));


function calcularIMC(peso, altura) {
    const imc = peso / (altura * altura);
    return imc;
}


function classificarIMC(imc) {
    if (imc < 16) {
        return 'Baixo peso (grau I)';
    } else if (imc >= 16 && imc <= 16.99) {
        return 'Baixo peso (grau II)';
    } else if (imc >= 17 && imc <= 18.49) {
        return 'Baixo peso (grau III)';
    } else if (imc >= 18.50 && imc <= 24.99) {
        return 'Peso adequado';
    } else if (imc >= 25 && imc <= 29.99) {
        return 'Sobrepeso';
    } else if (imc >= 30 && imc <= 34.99) {
        return 'Obesidade (grau I)';
    } else if (imc >= 35 && imc <= 39.99) {
        return 'Obesidade (grau II)';
    } else if (imc >= 40) {
        return 'Obesidade (grau III)';
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/calcular-imc', (req, res) => {
    try {
       
        const { nome, altura, peso } = req.body;
        
        
        if (!nome || !altura || !peso) {
            return res.status(400).send(`
                <html>
                <head>
                    <title>Erro</title>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                        .error { color: red; }
                    </style>
                </head>
                <body>
                    <h2 class="error">Erro: Todos os campos são obrigatórios!</h2>
                    <a href="/">Voltar</a>
                </body>
                </html>
            `);
        }

       
        const alturaNum = parseFloat(altura);
        const pesoNum = parseFloat(peso);
        
        if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
            return res.status(400).send(`
                <html>
                <head>
                    <title>Erro</title>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                        .error { color: red; }
                    </style>
                </head>
                <body>
                    <h2 class="error">Erro: Altura e peso devem ser números válidos e maiores que zero!</h2>
                    <a href="/">Voltar</a>
                </body>
                </html>
            `);
        }

     
        const imc = calcularIMC(pesoNum, alturaNum);
        const classificacao = classificarIMC(imc);
        
       
        let cor = '#333';
        if (classificacao.includes('Baixo peso')) {
            cor = '#3498db'; 
        } else if (classificacao === 'Peso adequado') {
            cor = '#27ae60'; 
        } else if (classificacao === 'Sobrepeso') {
            cor = '#f39c12'; 
        } else if (classificacao.includes('Obesidade')) {
            cor = '#e74c3c'; 
        }
        
       
        res.send(`
            <html>
            <head>
                <title>Resultado do IMC</title>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        margin: 0;
                        padding: 20px;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .container {
                        background: white;
                        padding: 40px;
                        border-radius: 15px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }
                    h1 {
                        color: #333;
                        margin-bottom: 30px;
                    }
                    .resultado {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 10px;
                        margin: 20px 0;
                        border-left: 4px solid ${cor};
                    }
                    .nome {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 15px;
                    }
                    .imc {
                        font-size: 20px;
                        color: #666;
                        margin-bottom: 10px;
                    }
                    .classificacao {
                        font-size: 22px;
                        font-weight: bold;
                        color: ${cor};
                        padding: 10px;
                        border-radius: 5px;
                        background: rgba(${cor === '#27ae60' ? '39, 174, 96' : cor === '#3498db' ? '52, 152, 219' : cor === '#f39c12' ? '243, 156, 18' : '231, 76, 60'}, 0.1);
                    }
                    .botao {
                        display: inline-block;
                        background: linear-gradient(45deg, #667eea, #764ba2);
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        margin-top: 20px;
                        transition: transform 0.3s;
                    }
                    .botao:hover {
                        transform: translateY(-2px);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>📊 Resultado do Cálculo de IMC</h1>
                    <div class="resultado">
                        <div class="nome">👤 ${nome}</div>
                        <div class="imc">📏 IMC: ${imc.toFixed(2)}</div>
                        <div class="classificacao">🏷️ ${classificacao}</div>
                    </div>
                    <a href="/" class="botao">🔄 Calcular Novamente</a>
                </div>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Erro ao processar dados:', error);
        res.status(500).send(`
            <html>
            <head>
                <title>Erro Interno</title>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                    .error { color: red; }
                </style>
            </head>
            <body>
                <h2 class="error">Erro interno do servidor!</h2>
                <a href="/">Voltar</a>
            </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📱 Acesse o formulário de IMC no navegador`);
});