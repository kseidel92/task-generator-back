import { Injectable } from '@nestjs/common';
import { Task, TaskGeneratorService } from '@domain';
import fetch from 'node-fetch';

@Injectable()
export class OpenRouterTaskGeneratorService implements TaskGeneratorService {
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  private readonly MODEL = 'mistralai/mistral-7b-instruct:free';

  async generateTasks(objective: string, apiKey: string): Promise<Task[]> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost',
        'X-Title': 'TaskGeneratorAPI',
      },
      body: JSON.stringify({
        model: this.MODEL,
        temperature: 0,
        max_tokens: 700,
        messages: [
          {
            role: 'system',
            content: `
Você é um gerador de subtarefas.

Gere APENAS um JSON válido (sem markdown, sem texto extra).

Gere NO MÁXIMO 7 subtarefas.
Nunca gere mais de 7 itens.

Formato obrigatório:
[
  {
    "index": 1,
    "title": "string",
    "isCompleted": false,
    "createdAt": "ISO-8601"
  }
]

Regras:
- index começa em 1
- isCompleted sempre false
- createdAt deve ser um timestamp ISO 8601
            `.trim(),
          },
          {
            role: 'user',
            content: objective,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data: any = await response.json();

    const rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('Resposta vazia do OpenRouter');
    }

    const cleaned = rawContent
      .replace(/<s>|<\/s>|<S>|<\/S>/g, '')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let tasksData: any[];
    try {
      tasksData = JSON.parse(cleaned);
    } catch {
      throw new Error(`JSON inválido retornado pelo modelo: ${cleaned}`);
    }

    return tasksData.map(
      (task) =>
        new Task({
          index: task.index,
          title: task.title,
          isCompleted: task.isCompleted,
          createdAt: task.createdAt,
        }),
    );
  }
}
