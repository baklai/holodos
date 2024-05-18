import { Scenes } from 'telegraf';

export class SceneGenerator {
  GenAgeScene() {
    const ageScene = new Scenes.BaseScene('age');

    ageScene.enter(async ctx => {
      await ctx.reply('Привет! Ты вошел в сцену возроста. Введи свой возпаст');
    });

    ageScene.on('text', async ctx => {
      const currAge = Number(ctx.message.text);
      if (currAge && currAge > 0) {
        await ctx.reply('Спасибо за возраст!');
      } else {
        await ctx.reply('Ты ошибся! Введи свой возраст!');
        // ctx.scene.reenter();
      }
    });

    ageScene.on('message', ctx => ctx.reply('Давай лучше возраст'));

    return ageScene;
  }
}
