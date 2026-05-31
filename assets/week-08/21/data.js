const LLM_STATS_API_KEY = 'sk_ze_b5rXc5zLCUt8m5kg7DeB2PcBD4k2uz_N23_0hmzmqO0';
const LLM_STATS_MODELS_URL = 'https://api.llm-stats.com/stats/v1/models?limit=200&max_input_price=100&sort=input_price';
const LLM_STATS_LOCAL_CACHE_URL = 'data/live-models.json';

const TASKS = [
  { id: 'pdf', label: 'summarize a PDF', tokens: 18000, outputRatio: 0.08 },
  { id: 'document', label: 'analyze a document', tokens: 52000, outputRatio: 0.12 },
  { id: 'codebase', label: 'process a codebase', tokens: 240000, outputRatio: 0.07 },
  { id: 'translate', label: 'translate text', tokens: 32000, outputRatio: 0.9 },
  { id: 'qa', label: 'answer questions', tokens: 9500, outputRatio: 0.2 },
  { id: 'archive', label: 'inspect an archive', tokens: 640000, outputRatio: 0.04 },
];

const FALLBACK_MODELS = [
  { id:'claude-haiku-4-5-20251001:anthropic', modelId:'claude-haiku-4-5-20251001', name:'Claude Haiku 4.5', company:'Anthropic', provider:'Anthropic', input:1, output:5, context:null, modalities:['image','text'], source:'cached fallback' },
  { id:'claude-opus-4-7:anthropic', modelId:'claude-opus-4-7', name:'Claude Opus 4.7', company:'Anthropic', provider:'Anthropic', input:5, output:25, context:null, modalities:['image','text'], source:'cached fallback' },
  { id:'claude-sonnet-4-6:anthropic', modelId:'claude-sonnet-4-6', name:'Claude Sonnet 4.6', company:'Anthropic', provider:'Anthropic', input:3, output:15, context:null, modalities:['audio','image','text','video'], source:'cached fallback' },
  { id:'deepseek-chat:deepseek', modelId:'deepseek-chat', name:'DeepSeek-V3.2', company:'DeepSeek', provider:'DeepSeek', input:0.28, output:0.42, context:null, modalities:['text'], source:'cached fallback' },
  { id:'deepseek-v4-flash-max:deepseek', modelId:'deepseek-v4-flash-max', name:'DeepSeek-V4-Flash-Max', company:'DeepSeek', provider:'DeepSeek', input:0.14, output:0.28, context:null, modalities:['text'], source:'cached fallback' },
  { id:'deepseek-r1-0528:deepseek', modelId:'deepseek-r1-0528', name:'DeepSeek-R1-0528', company:'DeepSeek', provider:'DeepSeek', input:0.55, output:2.19, context:null, modalities:['text'], source:'cached fallback' },
  { id:'gpt-5-2025-08-07:openai', modelId:'gpt-5-2025-08-07', name:'GPT-5', company:'OpenAI', provider:'OpenAI', input:1.25, output:10, context:null, modalities:['image','text'], source:'cached fallback' },
  { id:'gpt-5-mini-2025-08-07:openai', modelId:'gpt-5-mini-2025-08-07', name:'GPT-5 mini', company:'OpenAI', provider:'OpenAI', input:0.25, output:2, context:null, modalities:['image','text'], source:'cached fallback' },
  { id:'gpt-5-nano-2025-08-07:openai', modelId:'gpt-5-nano-2025-08-07', name:'GPT-5 nano', company:'OpenAI', provider:'OpenAI', input:0.05, output:0.4, context:null, modalities:['text'], source:'cached fallback' },
  { id:'gemini-2-5-pro:google', modelId:'gemini-2-5-pro', name:'Gemini 2.5 Pro', company:'Google', provider:'Google AI', input:1.25, output:10, context:2000000, modalities:['image','text'], source:'cached fallback' },
  { id:'gemini-2-5-flash:google', modelId:'gemini-2-5-flash', name:'Gemini 2.5 Flash', company:'Google', provider:'Google AI', input:0.3, output:2.5, context:1000000, modalities:['image','text'], source:'cached fallback' },
  { id:'llama-3-3-70b:deepinfra', modelId:'llama-3-3-70b', name:'Llama 3.3 70B', company:'Meta', provider:'DeepInfra', input:0.13, output:0.4, context:131000, modalities:['text'], source:'cached fallback' },
  { id:'mistral-large-latest:mistral', modelId:'mistral-large-latest', name:'Mistral Large', company:'Mistral', provider:'Mistral', input:2, output:6, context:128000, modalities:['text'], source:'cached fallback' },
  { id:'command-a-03-2025:cohere', modelId:'command-a-03-2025', name:'Command A', company:'Cohere', provider:'Cohere', input:2.5, output:10, context:256000, modalities:['text'], source:'cached fallback' },
  { id:'nova-pro:amazon', modelId:'nova-pro', name:'Nova Pro', company:'Amazon', provider:'Bedrock', input:0.8, output:3.2, context:300000, modalities:['text','image'], source:'cached fallback' },
  { id:'qwen-max:alibaba', modelId:'qwen-max', name:'Qwen Max', company:'Alibaba', provider:'Alibaba', input:1.6, output:6.4, context:32000, modalities:['text'], source:'cached fallback' },
];

const COMPANY_STYLES = [
  { className:'company-amber', mark:'OAI', paper:'#eee4c9', ink:'#241c13' },
  { className:'company-clay', mark:'ANT', paper:'#e5d5bf', ink:'#271a15' },
  { className:'company-blue', mark:'GGL', paper:'#dbe0d6', ink:'#161d24' },
  { className:'company-green', mark:'MET', paper:'#d9e0cc', ink:'#151e17' },
  { className:'company-red', mark:'MTR', paper:'#ead6cd', ink:'#2b1511' },
  { className:'company-grey', mark:'DPS', paper:'#dbd7cd', ink:'#171817' },
  { className:'company-violet', mark:'XAI', paper:'#ded8e6', ink:'#1a1421' },
  { className:'company-kraft', mark:'COH', paper:'#d5bd88', ink:'#241a0c' },
];
