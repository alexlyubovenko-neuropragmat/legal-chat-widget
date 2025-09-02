   // Чат-виджет для юридических консультаций
   (function() {
       // --- Стили ---
       const style = document.createElement('style');
       style.innerHTML = `
       #chat-widget-btn {
           position: fixed;
           bottom: 30px;
           right: 30px;
           background: #667eea;
           color: #fff;
           border: none;
           border-radius: 50%;
           width: 60px;
           height: 60px;
           font-size: 30px;
           cursor: pointer;
           z-index: 9999;
           box-shadow: 0 4px 16px rgba(0,0,0,0.2);
       }
       #chat-widget-window {
           position: fixed;
           bottom: 100px;
           right: 30px;
           width: 350px;
           max-width: 95vw;
           height: 420px;
           background: #fff;
           color: #222;
           border-radius: 16px;
           box-shadow: 0 8px 32px rgba(0,0,0,0.25);
           display: none;
           flex-direction: column;
           z-index: 10000;
           overflow: hidden;
       }
       #chat-widget-header {
           background: #667eea;
           color: #fff;
           padding: 16px;
           font-size: 1.1em;
           font-weight: bold;
           text-align: center;
       }
       #chat-widget-messages {
           flex: 1;
           padding: 12px;
           overflow-y: auto;
           background: #f7f7fb;
       }
       #chat-widget-input {
           display: flex;
           border-top: 1px solid #eee;
           background: #fff;
       }
       #chat-widget-input input {
           flex: 1;
           border: none;
           padding: 12px;
           font-size: 1em;
           outline: none;
           background: #fff;
       }
       #chat-widget-input button {
           background: #667eea;
           color: #fff;
           border: none;
           padding: 0 18px;
           font-size: 1em;
           cursor: pointer;
           border-radius: 0 0 16px 0;
       }
       `;
       document.head.appendChild(style);

       // --- Элементы ---
       const btn = document.createElement('button');
       btn.id = 'chat-widget-btn';
       btn.innerHTML = '💬';
       document.body.appendChild(btn);

       const win = document.createElement('div');
       win.id = 'chat-widget-window';
       win.innerHTML = `
           <div id="chat-widget-header">Юрист Калинина Оксана</div>
           <div id="chat-widget-messages"></div>
           <form id="chat-widget-input">
               <input type="text" placeholder="Задайте ваш вопрос..." autocomplete="off" />
               <button type="submit">⮞</button>
           </form>
       `;
       document.body.appendChild(win);

       const messages = win.querySelector('#chat-widget-messages');
       const inputForm = win.querySelector('#chat-widget-input');
       const input = inputForm.querySelector('input');

       // --- Логика ---
       function toggleChat() {
           win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
           if (win.style.display === 'flex') {
               input.focus();
               // Приветственное сообщение
               if (!messages.children.length) {
                   addMessage('Здравствуйте! Я помогу вам получить консультацию по следующим вопросам:\n• Семейное право\n• Наследственные дела\n• Недвижимость\n• Сопровождение бизнеса\n\nЗадайте ваш вопрос, и я помогу вам записаться на консультацию.', 'bot');
               }
           }
       }
       window.toggleChat = toggleChat;
       btn.onclick = toggleChat;

       function addMessage(text, from) {
           const msg = document.createElement('div');
           msg.style.margin = '8px 0';
           msg.style.textAlign = from === 'user' ? 'right' : 'left';
           msg.innerHTML = `<span style="display:inline-block;max-width:80%;padding:8px 12px;border-radius:12px;${from==='user'?'background:#667eea;color:#fff;':'background:#eee;color:#222;'}">${text.replace(/\n/g, '<br>')}</span>`;
           messages.appendChild(msg);
           messages.scrollTop = messages.scrollHeight;
       }

       inputForm.onsubmit = async function(e) {
           e.preventDefault();
           const text = input.value.trim();
           if (!text) return;
           addMessage(text, 'user');
           input.value = '';
           addMessage('...', 'bot');
           try {
               const res = await fetch('https://32c8339e7b1c.ngrok-free.app/webchat', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ message: text })
               });
               const data = await res.json();
               messages.lastChild.innerHTML = `<span style="display:inline-block;max-width:80%;padding:8px 12px;border-radius:12px;background:#eee;color:#222;">${data.response || data.error || 'Нет ответа от сервера.'}</span>`;
           } catch (err) {
               messages.lastChild.innerHTML = `<span style="display:inline-block;max-width:80%;padding:8px 12px;border-radius:12px;background:#eee;color:#222;">Извините, произошла ошибка. Пожалуйста, позвоните нам для консультации.</span>`;
           }
       };
   })();
