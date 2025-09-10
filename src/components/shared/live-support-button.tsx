"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Card, Space, Typography, Avatar, Input, message, Badge, Spin, Divider } from 'antd';
import { 
  MessageOutlined, 
  RobotOutlined, 
  UserOutlined, 
  SendOutlined,
  WhatsAppOutlined,
  SettingOutlined,
  CloseOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { useTranslation } from '@contexts/translation.context';
import AIService, { AIServiceConfig, AIMessage } from '../../service/ai.sevice';

const { Text } = Typography;
const { TextArea } = Input;

// Add modern styles
const modernSupportStyles = `
  .modern-support-modal .ant-modal-content {
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  
  .modern-support-modal .ant-modal-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
  }
  
  .modern-support-modal .ant-modal-body {
    padding: 0;
  }
  
  .modern-support-modal .ant-modal-close {
    top: 16px;
    right: 16px;
  }
`;

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'agent';
  message: string;
  timestamp: Date;
  sender?: string;
  isStreaming?: boolean;
}

interface LiveSupportProps {
  aiConfig?: AIServiceConfig;
  companyName?: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber?: string;
}

export const LiveSupportButton: React.FC<LiveSupportProps> = ({ 
  aiConfig,
  companyName = 'CumiTech',
  supportEmail = 'info@cumi.dev',
  supportPhone = '+237-673-687-549',
  whatsappNumber = '+237681289411'
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [supportMode, setSupportMode] = useState<'ai' | 'agent'>('ai');
  const [agentStatus, setAgentStatus] = useState<'available' | 'busy' | 'offline'>('available');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiService, setAIService] = useState<AIService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize AI service
  useEffect(() => {
    if (aiConfig) {
      try {
        const service = new AIService(aiConfig);
        setAIService(service);
        
        // Set initial AI greeting
        const greeting: ChatMessage = {
          id: '1',
          type: 'ai',
          message: `Hello! I'm your AI assistant for ${companyName}. How can I help you today?`,
          timestamp: new Date(),
        };
        setMessages([greeting]);
      } catch (error) {
        console.error('Failed to initialize AI service:', error);
        message.error('AI service initialization failed. Please check your configuration.');
      }
    } else {
      // Fallback to demo mode
      const greeting: ChatMessage = {
        id: '1',
        type: 'ai',
        message: 'Hello! I\'m your AI assistant (Demo Mode). How can I help you today?',
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [aiConfig, companyName]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create system prompt based on company context
  const createSystemPrompt = (): string => {
    return `You are a helpful customer support assistant for ${companyName}. 
    
    Your role:
    - Provide friendly, professional customer support
    - Answer questions about products, services, and policies
    - Help resolve customer issues
    - If you cannot help with something, offer to connect them with a human agent
    - Keep responses concise and helpful
    
    Company Information:
    - Company: ${companyName}
    - Support Email: ${supportEmail}
    - Support Phone: ${supportPhone}
    
    Guidelines:
    - Be empathetic and understanding
    - Provide accurate information only
    - If unsure, admit it and offer alternative help
    - Use a conversational but professional tone`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      if (supportMode === 'ai' && aiService) {
        await handleAIResponse(userMessage);
      } else {
        await handleAgentResponse(userMessage);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      setIsTyping(false);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact our support team directly.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleAIResponse = async (userMessage: ChatMessage) => {
    if (!aiService) {
      // Fallback to simple responses if no AI service
      setTimeout(() => {
        const response = getSimpleResponse(userMessage.message);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          message: response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    // Build conversation history
    const conversationHistory: AIMessage[] = [
      { role: 'system', content: createSystemPrompt() },
      ...messages
        .filter(m => m.type !== 'agent')
        .slice(-10) // Keep last 10 messages for context
        .map(m => ({
          role: m.type === 'user' ? 'user' as const : 'assistant' as const,
          content: m.message,
        })),
      { role: 'user', content: userMessage.message },
    ];

    // Create a streaming response message
    const streamingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      message: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, streamingMessage]);
    setIsTyping(false);

    try {
      await aiService.generateStreamingResponse(
        conversationHistory,
        (token: string) => {
          // Update the streaming message with new tokens
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, message: msg.message + token }
              : msg
          ));
        },
        (response: any) => {
          // Mark streaming as complete
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          ));
        },
        (error: any) => {
          console.error('AI Streaming Error:', error);
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { 
                  ...msg, 
                  message: 'I apologize, but I\'m having trouble responding right now. Please try again.',
                  isStreaming: false 
                }
              : msg
          ));
        }
      );
    } catch (error) {
      // Fallback to regular response
      const response = await aiService.generateResponse(conversationHistory);
      setMessages(prev => prev.map(msg => 
        msg.id === streamingMessage.id 
          ? { ...msg, message: response.content, isStreaming: false }
          : msg
      ));
    }
  };

  const handleAgentResponse = async (userMessage: ChatMessage) => {
    // Simulate agent response (replace with your live chat integration)
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        message: 'Thank you for your message. A live agent will respond to you shortly. Our typical response time is under 5 minutes.',
        timestamp: new Date(),
        sender: 'Live Support Team',
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getSimpleResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('help') || message.includes('support')) {
      return `I'm here to help! You can ask me about our services, or contact us directly at ${supportEmail} or ${supportPhone}. Would you like to connect with a live agent?`;
    }
    
    if (message.includes('course') || message.includes('learn')) {
      return 'We offer various courses and learning opportunities. You can browse our courses page or contact our team for more information about enrollment.';
    }
    
    if (message.includes('event') || message.includes('workshop')) {
      return 'We regularly host events and workshops! Check our events page for upcoming sessions. You can also register for events directly from the website.';
    }
    
    if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return `You can reach us at ${supportEmail} or call us at ${supportPhone}. Our support hours are Monday-Friday, 9 AM - 6 PM. Would you like to speak with someone directly?`;
    }
    
    return `Thank you for your message! I'm here to help with any questions about ${companyName}. Could you provide more details about what you need assistance with?`;
  };

  const connectToAgent = () => {
    if (agentStatus === 'offline') {
      message.warning('Live agents are currently offline. Please try again later or continue chatting with AI.');
      return;
    }
    
    if (agentStatus === 'busy') {
      message.info('All agents are currently busy. You\'re in queue. Please wait...');
      return;
    }
    
    try {
      // Clean the phone number - remove all non-numeric characters
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      
      // Validate phone number
      if (!cleanNumber || cleanNumber.length < 10) {
        message.error('Invalid WhatsApp number. Please contact support via email.');
        return;
      }
      
      // Create WhatsApp message
      const whatsappMessage = `Hello! I need support from ${companyName}. I was chatting with your AI assistant and would like to speak with a live agent.`;
      
      // Create WhatsApp URL with proper encoding
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Use setTimeout to prevent browser issues
      setTimeout(() => {
        try {
          // Open WhatsApp in a new tab with error handling
          const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
          
          if (newWindow) {
            message.success('Opening WhatsApp to connect with our live agent!');
          } else {
            // Fallback if popup is blocked - try direct navigation
            try {
              window.location.href = whatsappUrl;
            } catch (fallbackError) {
              console.error('Fallback navigation failed:', fallbackError);
              message.info('Please allow popups or copy this number to WhatsApp: ' + whatsappNumber);
            }
          }
        } catch (windowError) {
          console.error('Window open failed:', windowError);
          message.error('Unable to open WhatsApp. Please contact us directly at: ' + supportEmail);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      message.error('Unable to open WhatsApp. Please contact us directly at: ' + supportEmail);
    }
  };

  const getStatusColor = () => {
    switch (agentStatus) {
      case 'available': return '#52c41a';
      case 'busy': return '#faad14';
      case 'offline': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = () => {
    switch (agentStatus) {
      case 'available': return t('support.available') || 'Available';
      case 'busy': return t('support.busy') || 'Busy';
      case 'offline': return t('support.offline') || 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <>
      {/* Inject modern styles */}
      <style dangerouslySetInnerHTML={{ __html: modernSupportStyles }} />
      
      {/* Floating Support Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
        }}
      >
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<CustomerServiceOutlined />}
          onClick={() => setIsOpen(true)}
          style={{
            width: '64px',
            height: '64px',
            boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)',
            background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(24, 144, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(24, 144, 255, 0.3)';
          }}
        />
        
        {/* Status indicator */}
        <div
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        />
      </div>

      {/* Support Modal */}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '8px 0'
          }}>
            <Space>
              <CustomerServiceOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
              <span style={{ fontSize: '18px', fontWeight: '600' }}>
                {t('support.title') || 'Customer Support'}
              </span>
            </Space>
            <Badge 
              status={agentStatus === 'available' ? 'success' : agentStatus === 'busy' ? 'warning' : 'error'} 
              text={getStatusText()}
              style={{ fontSize: '12px' }}
            />
          </div>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={520}
        style={{ top: 20 }}
        styles={{ body: { padding: 0 } }}
        className="modern-support-modal"
      >
        <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
          {/* Mode Selector */}
          <div style={{ 
            padding: '20px', 
            borderBottom: '1px solid #f0f0f0',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ fontSize: '14px', color: '#666' }}>
                Choose Support Option
              </Text>
            </div>
            <Space size="middle">
              <Button
                type={supportMode === 'ai' ? 'primary' : 'default'}
                icon={<RobotOutlined />}
                onClick={() => setSupportMode('ai')}
                size="middle"
                style={{
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px',
                  fontWeight: '500'
                }}
              >
                {t('support.ai_chat') || 'AI Assistant'}
              </Button>
              <Button
                type="default"
                icon={<WhatsAppOutlined style={{ color: '#25D366' }} />}
                onClick={connectToAgent}
                size="middle"
                disabled={agentStatus === 'offline'}
                style={{
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px',
                  fontWeight: '500',
                  borderColor: '#25D366',
                  color: '#25D366'
                }}
              >
                {t('support.live_agent') || 'WhatsApp Agent'}
              </Button>
            </Space>
            {!aiConfig && (
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Demo Mode - Configure AI settings for full functionality
                </Text>
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div style={{ 
            flex: 1, 
            padding: '20px', 
            overflowY: 'auto', 
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
          }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  {msg.type !== 'user' && (
                    <Avatar
                      size="default"
                      icon={msg.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                      style={{
                        backgroundColor: msg.type === 'ai' ? '#1890ff' : '#52c41a',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                  <div
                    style={{
                      maxWidth: '75%',
                      backgroundColor: msg.type === 'user' ? '#1890ff' : 'white',
                      color: msg.type === 'user' ? 'white' : '#333',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: msg.type === 'user' ? 'none' : '1px solid #f0f0f0',
                      order: msg.type === 'user' ? -1 : 0,
                    }}
                  >
                    {msg.sender && (
                      <Text style={{ 
                        fontSize: '11px', 
                        opacity: 0.8, 
                        display: 'block',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        {msg.sender}
                      </Text>
                    )}
                    <div style={{ 
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.4',
                      fontSize: '14px'
                    }}>
                      {msg.message}
                      {msg.isStreaming && <Spin size="small" style={{ marginLeft: '8px' }} />}
                    </div>
                    <Text style={{ 
                      fontSize: '10px', 
                      opacity: 0.6, 
                      display: 'block', 
                      marginTop: '6px',
                      textAlign: 'right'
                    }}>
                      {msg.timestamp.toLocaleTimeString()}
                    </Text>
                  </div>
                  {msg.type === 'user' && (
                    <Avatar 
                      size="default" 
                      icon={<UserOutlined />} 
                      style={{ 
                        backgroundColor: '#52c41a',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }} 
                    />
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar 
                    size="default" 
                    icon={<RobotOutlined />} 
                    style={{ backgroundColor: '#1890ff' }} 
                  />
                  <div style={{
                    backgroundColor: 'white',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #f0f0f0'
                  }}>
                    <Space>
                      <Spin size="small" />
                      <Text style={{ fontStyle: 'italic', opacity: 0.7, fontSize: '14px' }}>
                        {supportMode === 'ai' ? 'AI is thinking...' : 'Agent is typing...'}
                      </Text>
                    </Space>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </Space>
          </div>

          {/* Input Area */}
          <div style={{ 
            padding: '20px', 
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#ffffff'
          }}>
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{ 
                  resize: 'none',
                  borderRadius: '12px 0 0 12px',
                  border: '1px solid #d9d9d9'
                }}
                disabled={isTyping}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                loading={isTyping}
                style={{
                  borderRadius: '0 12px 12px 0',
                  height: 'auto',
                  minHeight: '40px'
                }}
              />
            </Space.Compact>
            
            {/* Quick Actions */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Space size="small" wrap>
                <Button 
                  size="small" 
                  icon={<WhatsAppOutlined style={{ color: '#25D366' }} />}
                  onClick={connectToAgent}
                  style={{
                    borderRadius: '20px',
                    borderColor: '#25D366',
                    color: '#25D366'
                  }}
                >
                  WhatsApp Support
                </Button>
                <Button 
                  size="small" 
                  onClick={() => window.open(`mailto:${supportEmail}`, '_blank')}
                  style={{ borderRadius: '20px' }}
                >
                  Email Support
                </Button>
                <Button 
                  size="small" 
                  onClick={() => {
                    setMessages(messages.slice(0, 1)); // Keep initial greeting
                    message.success('Chat cleared');
                  }}
                  style={{ borderRadius: '20px' }}
                >
                  Clear Chat
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};