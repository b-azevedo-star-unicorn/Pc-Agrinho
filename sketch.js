// Variáveis do jogo
let cenaAtual = "inicio";
let botao;
let trator;
let plantacoes = [];
let baldeAgua = false;
let pontos = 0;
let tempo = 0;
let tempoLimite = 5 * 60 * 60; // 5 minutos (em frames)
let nivel = 1;
let objetivo = 100; // Meta para vencer
let proximoNivel = 50; // Pontos necessários para subir de nível

function setup() {
  createCanvas(800, 600);
  
  // Trator melhorado
  trator = {
    x: width/2,
    y: height - 100,
    largura: 120,
    altura: 70,
    velocidade: 6,
    plantando: false,
    regando: false,
    direcao: 1
  };
  
  criarBotao();
}

function criarBotao() {
  botao = createButton('INICIAR DESAFIO!');
  botao.position(width/2 - 110, height/2 + 180);
  botao.size(220, 60);
  botao.mousePressed(iniciarJogo);
  botao.style('font-size', '20px');
  botao.style('background', 'linear-gradient(to right, #FF5722, #FF9800)');
  botao.style('color', 'white');
  botao.style('border', 'none');
  botao.style('border-radius', '30px');
  botao.style('cursor', 'pointer');
  botao.style('box-shadow', '0 5px 15px rgba(0,0,0,0.3)');
  botao.style('font-weight', 'bold');
}

function draw() {
  background(220);
  
  switch(cenaAtual) {
    case "inicio": desenharInicio(); break;
    case "jogo": desenharJogo(); break;
    case "vitoria": desenharVitoria(); break;
    case "derrota": desenharDerrota(); break;
  }
}

// ========== CENA INICIAL ========== //
function desenharInicio() {
  // Céu dinâmico
  let skyGradient = drawingContext.createLinearGradient(0, 0, 0, height);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(1, '#E0F7FA');
  drawingContext.fillStyle = skyGradient;
  rect(0, 0, width, height);
  
  // Sol
  fill(255, 204, 0);
  noStroke();
  circle(100, 100, 80);
  
  // Terra com textura
  fill(139, 69, 19);
  rect(0, height - 100, width, 100);
  for (let i = 0; i < width; i += 30) {
    fill(101, 67, 33);
    rect(i, height - 100, 20, 10, 5);
  }
  
  // Título
  fill(40);
  textSize(48);
  textAlign(CENTER);
  textStyle(BOLD);
  text('🌰DESAFIO FAZENDA FELIZ🌱', width/2, 150);
  
  // Regras
  textSize(22);
  fill(60);
  text(`⏱️ Você tem 5 minutos para fazer ${objetivo} pontos!`, width/2, 220);
  text(`⭐ A cada ${proximoNivel} pontos, sobe de nível!`, width/2, 260);
  text(`💧 Regue as plantas para fazê-las crescer!`, width/2, 300);
  text(`❌ Menos de ${objetivo} pontos = DERROTA!`, width/2, 340);
  
  // Controles
  textSize(18);
  fill(70);
  text('Controles: ← → mover | Espaço plantar | R regar | A pegar água', width/2, 400);
}

// ========== CENA DO JOGO ========== //
function desenharJogo() {
  // Céu que escurece conforme o tempo passa
  let skyDarkness = map(tempo, 0, tempoLimite, 100, 20);
  background(135, 206, 235, skyDarkness);
  
  // Sol que se move
  fill(255, 255 - tempo/100, 0);
  noStroke();
  let sunX = map(tempo, 0, tempoLimite, 100, width - 100);
  circle(sunX, 100, 80);
  
  // Terra
  fill(139, 69, 19);
  rect(0, height - 100, width, 100);
  
  // Lago (fonte de água)
  fill(30, 144, 255);
  ellipse(50, height - 50, 150, 80);
  fill(0, 191, 255, 150);
  ellipse(50, height - 50, 120, 60);
  
  // Plantas
  for (let p of plantacoes) {
    desenharPlanta(p);
  }
  
  // Trator
  desenharTrator();
  
  // UI (Interface)
  fill(255, 230);
  rect(10, 10, 270, 140, 15);
  
  fill(0);
  textSize(20);
  textAlign(LEFT);
  text(`⏱️ Tempo: ${nf((tempoLimite - tempo)/60, 1, 1)}s`, 30, 40);
  text(`💰 Pontos: ${pontos}/${objetivo}`, 30, 70);
  text(`⭐ Nível: ${nivel} (Próximo: ${nivel * proximoNivel})`, 30, 100);
  text(`🌱 Plantas: ${plantacoes.length}`, 30, 130);
  
  // Balde de água
  if (baldeAgua) {
    fill(30, 144, 255, 200);
    rect(width - 140, 20, 120, 40, 20);
    fill(255);
    textAlign(CENTER);
    text('💧 BALDE CHEIO!', width - 80, 45);
  }
  
  // Atualiza tempo
  tempo++;
  
  // Verifica condições de vitória/derrota
  if (tempo >= tempoLimite) {
    if (pontos >= objetivo) {
      cenaAtual = "vitoria";
    } else {
      cenaAtual = "derrota";
    }
  }
  
  atualizarPlantas();
}

// ========== TRATOR DETALHADO ========== //
function desenharTrator() {
  push();
  translate(trator.x, trator.y);
  scale(trator.direcao, 1);
  
  // Corpo principal
  fill(220, 20, 60); // Vermelho escuro
  rect(-trator.largura/2, -trator.altura/2, trator.largura, trator.altura, 15);
  
  // Detalhes do trator
  fill(40);
  rect(-trator.largura/2 + 10, -trator.altura/2 + 10, trator.largura - 20, 15, 5);
  
  // Cabine
  fill(200, 230, 255, 180);
  rect(-trator.largura/4, -trator.altura/2, trator.largura/2, trator.altura/2, 5);
  
  // Rodas
  fill(30);
  ellipse(-trator.largura/3, trator.altura/2 - 10, 45, 40);
  ellipse(trator.largura/3, trator.altura/2 - 10, 45, 40);
  fill(80);
  ellipse(-trator.largura/3, trator.altura/2 - 10, 25, 25);
  ellipse(trator.largura/3, trator.altura/2 - 10, 25, 25);
  
  // Efeito de plantio/regagem
  if (trator.plantando || trator.regando) {
    fill(trator.plantando ? color(50, 200, 50, 150) : color(30, 144, 255, 150));
    ellipse(trator.largura/2 + 20, 10, trator.plantando ? 30 : 40);
  }
  
  pop();
}

// ========== PLANTAS QUE VALEM MAIS PONTOS ========== //
function desenharPlanta(p) {
  // Solo
  fill(101, 67, 33);
  circle(p.x, p.y, 30);
  
  // Planta (tamanho proporcional aos pontos)
  let alturaPlanta = p.tamanho * 0.8;
  
  // Caule
  fill(34, 139, 34);
  rect(p.x - 4, p.y - alturaPlanta, 8, alturaPlanta);
  
  // Folhas (tamanho dinâmico)
  fill(50, 200, 50);
  ellipse(p.x - 15, p.y - alturaPlanta * 0.7, 20 * p.tamanho/100, 15);
  ellipse(p.x + 15, p.y - alturaPlanta * 0.5, 20 * p.tamanho/100, 15);
  
  // Fruto (aparece quando grande)
  if (p.tamanho > 60) {
    fill(255, 165, 0);
    circle(p.x, p.y - alturaPlanta - 10, 15 * p.tamanho/100);
  }
  
  // Barra de água
  if (p.agua < 100) {
    fill(200);
    rect(p.x - 25, p.y - alturaPlanta - 30, 50, 6);
    fill(30, 144, 255);
    rect(p.x - 25, p.y - alturaPlanta - 30, 50 * (p.agua/100), 6);
  }
}

function atualizarPlantas() {
  for (let p of plantacoes) {
    // Consome água (mais rápido em níveis altos)
    if (frameCount % 60 === 0) {
      p.agua -= 3 + nivel * 0.5;
    }
    
    // Cresce se tiver água
    if (p.agua > 0) {
      p.tamanho = min(100, p.tamanho + 0.1 * (p.agua/100));
      
      // Calcula pontos (exponencial por nível)
      let novosPontos = floor(p.tamanho * 0.2 * nivel);
      if (novosPontos > p.ultimosPontos) {
        pontos += novosPontos - p.ultimosPontos;
        p.ultimosPontos = novosPontos;
        
        // Verifica se subiu de nível
        if (pontos >= nivel * proximoNivel) {
          nivel++;
        }
      }
    }
  }
}

// ========== CENA DE VITÓRIA ========== //
function desenharVitoria() {
  // Fundo comemorativo
  let winGradient = drawingContext.createLinearGradient(0, 0, 0, height);
  winGradient.addColorStop(0, '#4CAF50');
  winGradient.addColorStop(1, '#8BC34A');
  drawingContext.fillStyle = winGradient;
  rect(0, 0, width, height);
  
  // Confetes
  for (let i = 0; i < 50; i++) {
    fill(random(255), random(255), random(255));
    circle(random(width), random(height), random(5, 15));
  }
  
  // Mensagem
  fill(255);
  textSize(48);
  textAlign(CENTER);
  text('🎉 VITÓRIA! 🎉', width/2, 150);
  
  textSize(36);
  text(`Você fez ${pontos} pontos!`, width/2, 220);
  text(`Nível alcançado: ${nivel}`, width/2, 270);
  
  // Botão
  botao.html('JOGAR NOVAMENTE');
  botao.position(width/2 - 110, height/2 + 180);
  botao.mousePressed(reiniciarJogo);
  botao.show();
}

// ========== CENA DE DERROTA ========== //
function desenharDerrota() {
  // Fundo dramático
  let loseGradient = drawingContext.createLinearGradient(0, 0, 0, height);
  loseGradient.addColorStop(0, '#F44336');
  loseGradient.addColorStop(1, '#E91E63');
  drawingContext.fillStyle = loseGradient;
  rect(0, 0, width, height);
  
  // Mensagem
  fill(255);
  textSize(48);
  textAlign(CENTER);
  text('💔 DERROTA! 💔', width/2, 150);
  
  textSize(36);
  text(`Faltaram ${objetivo - pontos} pontos!`, width/2, 220);
  text(`Você fez apenas ${pontos}/${objetivo}`, width/2, 270);
  
  // Dica
  textSize(24);
  text('Regue mais as plantas para crescerem rápido!', width/2, 330);
  
  // Botão
  botao.html('TENTAR NOVAMENTE');
  botao.position(width/2 - 110, height/2 + 180);
  botao.mousePressed(reiniciarJogo);
  botao.show();
}

// ========== CONTROLES ========== //
function keyPressed() {
  if (cenaAtual === "jogo") {
    // Movimento
    if (keyCode === LEFT_ARROW) {
      trator.x -= trator.velocidade;
      trator.direcao = -1;
    } else if (keyCode === RIGHT_ARROW) {
      trator.x += trator.velocidade;
      trator.direcao = 1;
    }
    
    // Limites
    trator.x = constrain(trator.x, trator.largura/2, width - trator.largura/2);
    
    // Plantar
    if (key === ' ' && !trator.plantando) {
      trator.plantando = true;
      setTimeout(() => {
        plantacoes.push({
          x: trator.x + 40 * trator.direcao,
          y: trator.y + 5,
          tamanho: 10,
          agua: 50,
          ultimosPontos: 0
        });
        trator.plantando = false;
      }, 300);
    }
    
    // Regar
    if (key.toLowerCase() === 'r' && baldeAgua && !trator.regando) {
      trator.regando = true;
      setTimeout(() => {
        for (let p of plantacoes) {
          if (dist(p.x, p.y, trator.x + 40 * trator.direcao, trator.y + 5) < 50) {
            p.agua = min(100, p.agua + 40);
          }
        }
        baldeAgua = false;
        trator.regando = false;
      }, 500);
    }
    
    // Pegar água
    if (key.toLowerCase() === 'a' && !baldeAgua && trator.x < 150) {
      baldeAgua = true;
    }
  }
}

function iniciarJogo() {
  cenaAtual = "jogo";
  botao.hide();
  pontos = 0;
  tempo = 0;
  nivel = 1;
  plantacoes = [];
}

function reiniciarJogo() {
  iniciarJogo();
}