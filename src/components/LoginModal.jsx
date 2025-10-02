import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { createUser } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    language: 'en',
    character: 'astronaut'
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const characters = [
    { id: 'astronaut', name: 'Astronaut', emoji: '👨‍🚀' },
    { id: 'alien', name: 'Cosmic Friend', emoji: '👽' },
    { id: 'robot', name: 'Space Robot', emoji: '🤖' }
  ];


  React.useEffect(() => {
    const isValid = formData.username.trim().length >= 3 && formData.language;
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (isFormValid) {
      createUser(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" id="login-modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>🚀 Join the Space Adventure!</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="login-form">
            <div className="character-preview">
              <div className="selected-character" id="preview-character">
                <div className={`character-avatar ${formData.character}`}>
                  {characters.find(c => c.id === formData.character)?.emoji}
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Space Explorer Name:</label>
              <input 
                type="text" 
                id="username" 
                placeholder="Enter your space name" 
                maxLength="20"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={formData.username.trim().length >= 3 ? 'valid' : formData.username.trim().length > 0 ? 'invalid' : ''}
              />
            </div>
            
            
            <div className="form-group">
              <label htmlFor="language">{t('preferredLanguage')}</label>
              <select 
                id="language"
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} {lang.flag}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="character-selection">
              <label>{t('chooseYourCharacter')}</label>
              <div className="character-options">
                {characters.map(char => (
                  <div 
                    key={char.id}
                    className={`character-option ${formData.character === char.id ? 'active' : ''}`} 
                    data-character={char.id} 
                    onClick={() => handleInputChange('character', char.id)}
                  >
                    <div className={`character-avatar ${char.id}`}>
                      {char.emoji}
                    </div>
                    <span>{t(char.id === 'astronaut' ? 'astronaut' : char.id === 'alien' ? 'cosmicFriend' : 'spaceRobot')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-btn" 
            onClick={handleSubmit} 
            id="create-profile-btn" 
            disabled={!isFormValid}
          >
            {t('startAdventure')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;