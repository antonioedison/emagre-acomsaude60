
import React from 'react';
import { ContentSection, ShopItem } from './types';
import { Coffee, GlassWater, Moon, Utensils, Zap, Salad, Ban, Dumbbell, Sparkles, ClipboardList } from 'lucide-react';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 5000];

export const CHALLENGE_QUOTES = [
  "O primeiro passo é o mais importante. Acredite em você!",       // Dias 0-4
  "A constância é a chave do sucesso. Continue firme!",           // Dias 5-9
  "Você é mais forte do que imagina. Não desista!",               // Dias 10-14
  "Resultados levam tempo. Ame o processo de mudança.",           // Dias 15-19
  "Um terço do caminho já foi! Orgulhe-se de cada escolha.",      // Dias 20-24
  "Sua saúde é seu maior investimento. Cuide-se!",                // Dias 25-29
  "Metade do desafio! Olhe para trás e veja sua evolução.",       // Dias 30-34
  "Disciplina é escolher o que você quer agora vs o que quer mais.", // Dias 35-39
  "Cada dia conta. Faça suas escolhas valerem a pena.",           // Dias 40-44
  "A reta final se aproxima. Dê o seu melhor agora!",             // Dias 45-49
  "Falta pouco! Sinta a energia da vitória chegando.",            // Dias 50-54
  "Você conseguiu chegar até aqui. Finalize com chave de ouro!"   // Dias 55-60
];

export const AVATARS = [
  { id: 'woman_blonde', icon: '👱‍♀️', label: 'Mulher Loira', shirtColor: 'bg-pink-400' },
  { id: 'woman_brunette', icon: '👩', label: 'Mulher Morena', shirtColor: 'bg-purple-500' },
  { id: 'woman_black', icon: '👩🏾', label: 'Mulher Negra', shirtColor: 'bg-amber-500' },
  { id: 'woman_old', icon: '👵', label: 'Senhora', shirtColor: 'bg-rose-400' },
  { id: 'man_black', icon: '👨🏾', label: 'Homem Negro', shirtColor: 'bg-emerald-500' },
  { id: 'man_native', icon: '🧔🏽', label: 'Homem Moreno', shirtColor: 'bg-orange-500' },
  { id: 'young', icon: '🧒', label: 'Jovem', shirtColor: 'bg-cyan-400' },
  { id: 'old', icon: '👴', label: 'Senhor', shirtColor: 'bg-gray-500' }
];

export const SHOP_ITEMS: ShopItem[] = [
  // --- TEMAS ---
  {
    id: 'theme_default',
    type: 'theme',
    name: 'Padrão Aqua',
    description: 'O visual clássico do app.',
    price: 0,
    rarity: 'common',
    value: { from: '#00B4D8', to: '#48CAE4', text: 'text-brand-darkGreen', bg: 'bg-brand-aqua' }
  },
  {
    id: 'feature_darkmode',
    type: 'theme',
    name: 'Modo Escuro',
    description: 'Ativa o tema noturno no aplicativo.',
    price: 700,
    rarity: 'epic',
    value: { from: '#1e293b', to: '#0f172a', text: 'text-white', bg: 'bg-slate-800' }
  },
  {
    id: 'feature_pinkmode',
    type: 'theme',
    name: 'Modo Rosa',
    description: 'Deixa o aplicativo com tons de rosa claro.',
    price: 500,
    rarity: 'epic',
    value: { from: '#fce7f3', to: '#fbcfe8', text: 'text-pink-900', bg: 'bg-pink-500' }
  },
  {
    id: 'theme_coral',
    type: 'theme',
    name: 'Coral Sunset',
    description: 'Tons quentes de coral e laranja.',
    price: 100,
    rarity: 'common',
    value: { from: '#FF7F50', to: '#FF6347', text: 'text-orange-900', bg: 'bg-orange-500' }
  },
  {
    id: 'theme_purple',
    type: 'theme',
    name: 'Purple Dreams',
    description: 'Roxos vibrantes e místicos.',
    price: 150,
    rarity: 'rare',
    value: { from: '#8A2BE2', to: '#4B0082', text: 'text-purple-900', bg: 'bg-purple-600' }
  },
  
  // --- CONFETES ---
  {
    id: 'confetti_default',
    type: 'confetti',
    name: 'Confete Padrão',
    description: 'Cores da marca.',
    price: 0,
    rarity: 'common',
    value: ['#00B4D8', '#FFD60A', '#48CAE4']
  },
  {
    id: 'confetti_neon',
    type: 'confetti',
    name: 'Confete Neon',
    description: 'Explosão de cores neon.',
    price: 80,
    rarity: 'common',
    value: ['#FF00FF', '#00FF00', '#00FFFF', '#FFFF00']
  },
  {
    id: 'confetti_rainbow',
    type: 'confetti',
    name: 'Confete Arco-íris',
    description: 'Todas as cores do arco-íris.',
    price: 120,
    rarity: 'rare',
    value: ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE']
  },

  // --- MOLDURAS (AROS) ---
  {
    id: 'frame_none',
    type: 'frame',
    name: 'Sem Aro',
    description: 'Simples e limpo.',
    price: 0,
    rarity: 'common',
    value: 'ring-0'
  },
  {
    id: 'frame_gold',
    type: 'frame',
    name: 'Aro Dourado',
    description: 'Brilho dourado no nível.',
    price: 200,
    rarity: 'epic',
    value: 'ring-4 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]'
  },
  {
    id: 'frame_diamond',
    type: 'frame',
    name: 'Aro Diamante',
    description: 'Luxo supremo em diamante.',
    price: 500,
    rarity: 'legendary',
    value: 'ring-4 ring-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)]'
  },

  // --- EFEITOS ESPECIAIS (NOVO) ---
  {
    id: 'effect_none',
    type: 'effect',
    name: 'Sem Efeito',
    description: 'Visual padrão.',
    price: 0,
    rarity: 'common',
    value: null
  },
  {
    id: 'effect_fire',
    type: 'effect',
    name: 'Chama Motivadora',
    description: 'Uma chama de energia no fundo da tela inicial.',
    price: 300,
    rarity: 'rare',
    value: 'fire'
  },
  {
    id: 'effect_pulse_card',
    type: 'effect',
    name: 'Motivação Pulsante',
    description: 'Faz o card de motivação diária piscar.',
    price: 300,
    rarity: 'rare',
    value: 'pulse_card'
  }
];

export const SECTIONS: ContentSection[] = [
  {
    id: 'teas',
    title: 'Chás para Emagrecer',
    description: 'Acelere seu metabolismo com estas receitas potentes.',
    icon: 'Coffee',
    color: 'bg-green-500',
    xpReward: 100,
    contentType: 'recipe-list',
    data: [
      {
        name: 'Chá de Hibisco com Canela',
        ingredients: ['1 colher de sopa de hibisco seco', '1 pau de canela', '500ml de água'],
        preparation: ['Ferva a água', 'Adicione o hibisco e a canela', 'Tampe e deixe descansar por 10 min', 'Coe e beba'],
        benefits: 'Reduz a retenção de líquidos e controla picos de insulina.'
      },
      {
        name: 'Chá Verde com Limão e Gengibre',
        ingredients: ['1 sachê ou colher de chá verde', 'Suco de meio limão', '2 rodelas de gengibre', '300ml de água'],
        preparation: ['Aqueça a água (não deixe ferver)', 'Adicione o chá e o gengibre', 'Abofe por 5 min', 'Adicione o limão antes de beber'],
        benefits: 'Termogênico natural que acelera a queima de gordura.'
      },
      {
        name: 'Chá de Dente-de-leão',
        ingredients: ['1 colher de raiz de dente-de-leão', '300ml de água'],
        preparation: ['Ferva a água com a raiz por 3 min', 'Desligue e deixe repousar por 5 min', 'Coe e sirva'],
        benefits: 'Melhora a digestão e combate o inchaço abdominal.'
      }
    ]
  },
  {
    id: 'quick-recipes',
    title: 'Receitas Rápidas',
    description: 'Pratos saudáveis que ficam prontos em minutos.',
    icon: 'Utensils',
    color: 'bg-orange-500',
    xpReward: 150,
    contentType: 'recipe-list',
    data: [
      {
        name: 'Salada de Frango com Manga',
        ingredients: ['Peito de frango grelhado em cubos', '1/2 manga picada', '1/2 abacate', 'Folhas verdes', 'Limão e azeite'],
        preparation: ['Misture todos os ingredientes em uma tigela', 'Tempere com limão, sal e azeite'],
        benefits: 'Rica em proteínas e gorduras boas que dão saciedade.'
      },
      {
        name: 'Omelete de Espinafre',
        ingredients: ['2 ovos', '1 punhado de espinafre picado', 'Sal e pimenta', '1 colher de requeijão light'],
        preparation: ['Bata os ovos com temperos', 'Coloque na frigideira antiaderente', 'Adicione o espinafre e o requeijão', 'Dobre e sirva'],
        benefits: 'Café da manhã ou jantar leve e proteico.'
      },
      {
        name: 'Coxinha Fit de Batata Doce',
        ingredients: ['Batata doce cozida e amassada', 'Frango desfiado temperado', 'Farinha de linhaça para empanar'],
        preparation: ['Modele a massa de batata', 'Recheie com frango', 'Passe na farinha de linhaça', 'Asse na Airfryer por 15 min a 180°C'],
        benefits: 'Versão saudável de um clássico, rica em fibras.'
      },
      {
        name: 'Salada de Quinoa',
        ingredients: [
          '1 xícara de quinoa cozida',
          '1/2 xícara de tomate cereja cortado ao meio',
          '1/2 xícara de pepino cortado em cubinhos',
          '1/2 xícara de pimentão vermelho cortado em cubinhos',
          '1/4 xícara de cebola roxa picada',
          '1/4 xícara de coentro fresco picado',
          '2 colheres de sopa de azeite de oliva',
          '2 colheres de sopa de suco de limão',
          'Sal e pimenta a gosto'
        ],
        preparation: ['Misture todos os ingredientes em uma tigela e tempere com sal e pimenta a gosto.'],
        benefits: 'Rica em fibras, proteínas completas e muito refrescante.'
      },
      {
        name: 'Arroz Integral com Legumes',
        ingredients: [
          '1 xícara de arroz integral',
          '3 xícaras de água',
          '1/2 xícara de cenoura picada',
          '1/2 xícara de brócolis picado',
          '1/2 xícara de couve-flor picada',
          '1/2 xícara de ervilhas frescas',
          '1 dente de alho picado',
          '1 colher de sopa de azeite',
          'Sal e pimenta-do-reino a gosto'
        ],
        preparation: [
          'Em uma panela, refogue o alho no azeite até dourar.',
          'Adicione o arroz integral e a água e cozinhe até que o arroz esteja macio.',
          'Em outra panela, cozinhe a cenoura, o brócolis, a couve-flor e as ervilhas no vapor até que fiquem macios.',
          'Adicione os legumes cozidos ao arroz integral e misture bem. Tempere com sal e pimenta-do-reino a gosto. Sirva quente.'
        ],
        benefits: 'Refeição completa com carboidratos complexos e fibras.'
      },
      {
        name: 'Salada de Frango Grelhado com Molho de Iogurte',
        ingredients: [
          '1 peito de frango grelhado, cortado em tiras',
          '2 xícaras de alface americana picada',
          '1 xícara de tomates-cereja cortados ao meio',
          '1/2 xícara de cebola roxa picada',
          '1/4 xícara de coentro picado',
          '1/4 xícara de iogurte grego',
          '2 colheres de sopa de suco de limão',
          '1 colher de sopa de azeite',
          'Sal e pimenta-do-reino a gosto'
        ],
        preparation: [
          'Em uma tigela grande, misture o frango, a alface, os tomates-cereja, a cebola e o coentro.',
          'Em outra tigela, misture o iogurte, o suco de limão e o azeite. Tempere com sal e pimenta-do-reino a gosto.',
          'Despeje o molho sobre a salada e misture bem. Sirva imediatamente.'
        ],
        benefits: 'Alta proteína com molho cremoso e saudável.'
      }
    ]
  },
  {
    id: 'foods-to-eat',
    title: '10 Super Alimentos',
    description: 'Os melhores aliados na perda de peso.',
    icon: 'Salad',
    color: 'bg-emerald-500',
    xpReward: 80,
    contentType: 'text-list',
    data: [
      { title: 'Ovos', text: 'Ricos em proteína e colina, aumentam a saciedade.' },
      { title: 'Frutas Vermelhas', text: 'Baixas calorias e muitos antioxidantes.' },
      { title: 'Vegetais Verdes', text: 'Muito volume, fibras e pouquíssimas calorias.' },
      { title: 'Salmão', text: 'Fonte de ômega-3 que ajuda a combater inflamação.' },
      { title: 'Peito de Frango', text: 'Proteína magra essencial para manutenção muscular.' },
      { title: 'Feijão', text: 'Combinação de fibra e proteína que segura a fome.' },
      { title: 'Nozes', text: 'Gorduras boas que controlam o apetite (com moderação).' },
      { title: 'Batata-Doce', text: 'Carboidrato complexo de lenta absorção.' },
      { title: 'Iogurte Grego', text: 'Probióticos e o dobro de proteína do normal.' },
      { title: 'Grãos Integrais', text: 'Aveia e quinoa melhoram o trânsito intestinal.' }
    ]
  },
  {
    id: 'hydration',
    title: 'Guia da Água',
    description: 'Hidratação para emagrecer',
    icon: 'GlassWater',
    color: 'bg-blue-500',
    xpReward: 50,
    contentType: 'guide',
    data: {
      sections: [] // Handled via custom UI now
    }
  },
  {
    id: 'breakfast',
    title: 'Café da Manhã',
    description: 'Comece o dia com energia',
    icon: 'Zap',
    color: 'bg-yellow-500',
    xpReward: 100,
    contentType: 'guide',
    data: {
        sections: [] // Handled via custom UI
    }
  },
  {
    id: 'daily-guidelines',
    title: 'Orientações Diárias',
    description: 'Plano básico e orientações essenciais.',
    icon: 'ClipboardList',
    color: 'bg-cyan-600',
    xpReward: 110,
    contentType: 'daily-guidelines',
    data: {
       intro: "Siga as orientações para alcançar os resultados, começando pela alimentação, faça 4 refeições diárias, tome água, pratique exercícios (Treino Tabata para perder peso), durma bem e opte pelos alimentos de baixo teor calórico.",
       meals: [
           {
               title: 'Café da Manhã',
               icon: 'Sun',
               color: 'orange',
               items: [
                   '1 pão francês',
                   '1 ovo frito ou mexido na frigideira untada com óleo (pouquíssimo óleo) <span class="text-xs text-gray-500 italic">(o ovo tem 5g proteína e 5g gordura)</span>',
                   '1 (uma) fatia de mussuarela (25g) <span class="text-xs text-gray-500 italic">(7g proteína e 4g gordura)</span>',
                   '1 (uma) xícara de café com leite com pouquíssima açúcar (use açúcar demerara)'
               ]
           },
           {
               title: 'Almoço',
               icon: 'Utensils',
               color: 'blue',
               items: [
                   'Filé de frango <strong class="text-xs uppercase">OU</strong> carne moída',
                   '1 (uma) escumadeira de Arroz',
                   '1 (uma) concha de feijão',
                   'Salada, metade do seu prato'
               ]
           },
           {
               title: 'Chá da Tarde',
               icon: 'Coffee',
               color: 'green',
               items: [
                   'Escolha chá de hibisco com canela ou chá verde com limão e gengibre',
                   'Torrada integral com mel <span class="text-xs text-gray-500">(evite o excesso pois o mel calórico)</span>',
                   '<strong class="text-xs uppercase text-green-600">OU</strong> Iogurte natural com frutas e castanha <span class="text-xs text-gray-500">(evite o excesso pois as oleaginosas são calóricas)</span>'
               ]
           },
           {
               title: 'Jantar',
               icon: 'Moon',
               color: 'indigo',
               items: [
                   '1 (uma) escumadeira de Arroz',
                   '1 (uma) concha de feijão',
                   '1 a 2 Ovos',
                   'Legumes e verduras',
                   'Salada Metade do seu prato'
               ]
           }
       ],
       tips: [
           { icon: 'Clock', text: 'As Carnes no geral demoram mais tempo a sua digestão, a digestão da carne no estômago geralmente leva de 3 a 5 horas, dependendo do tipo e do preparo.' },
           { icon: 'Apple', text: 'Sempre que sentir fome coma uma porção de frutas' }
       ]
    }
  },
  {
    id: 'foods-to-avoid',
    title: 'Alimentos para evitar',
    description: 'Sabotadores Silenciosos',
    icon: 'Ban',
    color: 'bg-red-500',
    xpReward: 50,
    contentType: 'avoid-list',
    data: {
        intro: "Esses alimentos parecem inofensivos, mas são os maiores responsáveis por sabotar seu emagrecimento. Evitá-los é tão importante quanto comer bem!",
        items: [
            { 
                icon: '🍟', 
                name: 'Frituras', 
                why: 'Alto teor calórico, gorduras trans, inflamação, dificulta digestão',
                sub: 'Assados, grelhados ou cozidos no vapor'
            },
            { 
                icon: '📦', 
                name: 'Alimentos Processados', 
                why: 'Cheios de sódio, conservantes, açúcar escondido, zero nutrientes',
                sub: 'Comida fresca e caseira'
            },
            { 
                icon: '🥤', 
                name: 'Refrigerantes', 
                why: '1 lata = 10 colheres de açúcar, vicia, engorda, diabetes',
                sub: 'Água, chás naturais, água com gás e limão'
            },
            { 
                icon: '🍰', 
                name: 'Doces e Açúcar', 
                why: 'Pico de insulina, acumula gordura, vicia, inflamação',
                sub: 'Frutas frescas, mel, tâmaras'
            },
            { 
                icon: '🍺', 
                name: 'Álcool', 
                why: 'Calorias vazias, prejudica metabolismo, aumenta apetite',
                sub: 'Água saborizada, drinks sem álcool'
            },
            { 
                icon: '🍞', 
                name: 'Pão Branco', 
                why: 'Alto índice glicêmico, zero fibras, não sacia',
                sub: 'Pão integral, pão de grãos, tapioca'
            }
        ]
    }
  },
  {
    id: 'sleep',
    title: 'Sono Saudável',
    description: 'Emagreça dormindo (literalmente).',
    icon: 'Moon',
    color: 'bg-indigo-500',
    xpReward: 70,
    contentType: 'guide',
    data: {
        sections: [
            // Handled via custom UI
        ]
    }
  },
  {
    id: 'tabata',
    title: 'Treino Tabata',
    description: '4 minutos para queimar gordura por horas.',
    icon: 'Dumbbell',
    color: 'bg-purple-600',
    xpReward: 200,
    contentType: 'guide',
    data: {
        sections: [
             { title: 'O que é Treino Tabata?', text: 'Protocolo de treino de alta intensidade: 20 segundos de exercício intenso seguidos de 10 segundos de descanso, repetido por 8 rounds (4 minutos).' },
             { title: 'Benefícios', text: 'Queima até 15 calorias por minuto. Aumenta metabolismo por 24-48 horas. Melhora condicionamento cardiovascular.' }
        ]
    }
  },
  {
    id: 'valuable-tips',
    title: 'Dicas Valiosas',
    description: 'Dicas para turbinar seus resultados',
    icon: 'Sparkles',
    color: 'bg-pink-500',
    xpReward: 120,
    contentType: 'valuable-tips',
    data: {
        juices: [
          {
            name: 'Suco Verde Detox',
            icon: '🥬',
            ingredients: ['Couve', 'Limão', 'Gengibre', 'Maçã verde', 'Água de coco ou água'],
            benefits: 'Desintoxica, acelera metabolismo, reduz inchaço',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800'
          },
          {
            name: 'Suco de Beterraba',
            icon: '🧃',
            ingredients: ['Beterraba', 'Cenoura', 'Laranja', 'Gengibre'],
            benefits: 'Energia, melhora circulação, rico em ferro',
            bgColor: 'bg-red-100',
            textColor: 'text-red-800'
          }
        ],
        menus: {
            'Café da Manhã': ['Omelete (2 ovos) + pão integral + abacate', 'Iogurte grego + frutas vermelhas + granola', 'Smoothie verde + tapioca com queijo'],
            'Lanche': ['Frutas frescas + castanhas', 'Iogurte natural + chia', 'Cenoura baby + hummus'],
            'Almoço': ['Arroz integral + feijão + frango grelhado + salada', 'Peixe assado + batata-doce + legumes', 'Quinoa + carne magra + vegetais'],
            'Jantar': ['Sopa de legumes + omelete', 'Salada completa com atum', 'Wrap integral com frango e vegetais']
        },
        goldenTips: [
            { icon: '🍽️', text: 'Coma devagar e mastigue bem' },
            { icon: '📏', text: 'Use pratos menores' },
            { icon: '💧', text: 'Beba água antes das refeições' },
            { icon: '🥗', text: 'Comece sempre pela salada' },
            { icon: '⏰', text: 'Não fique mais de 4h sem comer' },
            { icon: '📵', text: 'Desligue TV e celular ao comer' },
            { icon: '🏃', text: 'Ande pelo menos 30min por dia' },
            { icon: '😴', text: 'Durma 7-9 horas toda noite' },
            { icon: '📝', text: 'Planeje suas refeições' },
            { icon: '🎯', text: 'Foco no progresso, não na perfeição' }
        ]
    }
  }
];
