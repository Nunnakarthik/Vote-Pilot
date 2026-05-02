import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderChatView } from './chat.js';

describe('Chat Component', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render the chat interface', () => {
    renderChatView(container);
    
    const chatWindow = container.querySelector('.chat-window');
    expect(chatWindow).not.toBeNull();
    
    const chatInput = container.querySelector('#chat-input');
    expect(chatInput).not.toBeNull();
    
    const sendBtn = container.querySelector('#chat-send-btn');
    expect(sendBtn).not.toBeNull();
  });
});
