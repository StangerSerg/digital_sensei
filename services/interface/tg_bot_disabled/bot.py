from datetime import datetime

from aiogram import Bot, Dispatcher
import asyncio

import constants

bot = Bot(token=constants.BOT_TOKEN)
dp = Dispatcher()


async def main():
    try:
        print("=" * 50)
        print("🍽️  Додзё материализуется...")
        print(f"🤖 Версия: MVP 0.1")
        print(f"📅 {datetime.now().strftime('%d.%m.%Y %H:%M')}")
        print("=" * 50)
        print("Жми /start, если готов!")
        print("=" * 50)

        await dp.start_polling(bot)
    except:
        return
    finally:
        await bot.session.close()
        print("🔴 Бот остановлен, сессия закрыта")







if __name__ == "__main__":
    asyncio.run(main())