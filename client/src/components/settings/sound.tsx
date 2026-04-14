import React, { ChangeEvent, useState } from 'react';
import store from 'store';
import { useTranslation } from 'react-i18next';

import './sound.css';
import { Spacer } from '@freecodecamp/ui';
import { playTone, playAmbientSound, stopAmbientSound, AmbientSoundTypes } from '../../utils/tone';
import ToggleButtonSetting from './toggle-button-setting';

type SoundProps = {
  sound: boolean;
  toggleSoundMode: (sound: boolean) => void;
};

export default function SoundSettings({
  sound,
  toggleSoundMode
}: SoundProps): JSX.Element {
  const { t } = useTranslation();
  const [volumeDisplay, setVolumeDisplay] = useState(
    (store.get('soundVolume') as number) ?? 50
  );
  const [ambientType, setAmbientType] = useState<AmbientSoundTypes | null>(
  (store.get('ambientSound') as AmbientSoundTypes) ?? null
);
const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = Number(event.target.value);

    store.set('soundVolume', inputValue);

    setVolumeDisplay((store.get('soundVolume') as number) ?? 50);

    if (mayPlay) {
      void playTone('tests-completed');
      setMayPlay(false);
      setTimeout(() => {
        setMayPlay(true);
      }, 200);
    }
  }
  function handleAmbientSoundChange(type: AmbientSoundTypes) {
  store.set('ambientSound', type);
  setAmbientType(type);
}

function handleAmbientPlay() {
  if (ambientType) {
    void playAmbientSound(ambientType);
    setIsAmbientPlaying(true);
  }
}

function handleAmbientStop() {
  stopAmbientSound();
  setIsAmbientPlaying(false);
}

  return (
    <>
      <ToggleButtonSetting
        action={t('settings.labels.sound-mode')}
        explain={t('settings.sound-mode')}
        flag={sound}
        flagName='sound'
        offLabel={t('buttons.off')}
        onLabel={t('buttons.on')}
        toggleFlag={() => {
          toggleSoundMode(sound ? false : true);
        }}
      />
      <label htmlFor='volumeslider'>
        {t('settings.sound-volume')}{' '}
        <span aria-hidden='true'>{volumeDisplay}</span>
      </label>
      <input
        type='range'
        min='10'
        max='100'
        id='volumeslider'
        defaultValue={volumeDisplay}
        className='soundbar'
        onInput={handleVolumeChange}
      />
      
      <Spacer size='m' />
      <div className='ambient-sound-settings'>
        <label htmlFor='ambient-sound-select'>
          Ambient Sound:
        </label>
        <select
          id='ambient-sound-select'
          value={ambientType ?? ''}
          onChange={e =>
            handleAmbientSoundChange(
              e.target.value as AmbientSoundTypes
            )
          }
        >
          <option value=''>-- Select Sound --</option>
          <option value='bonfire'>🔥 Bonfire</option>
          <option value='rain'>🌧️ Rain</option>
          <option value='night-crickets'>🦗 Night Crickets</option>
        </select>
        <button
          disabled={!ambientType}
          onClick={handleAmbientPlay}
        >
          {isAmbientPlaying ? '🔊 Playing...' : '▶️ Play'}
        </button>
        <button
          disabled={!isAmbientPlaying}
          onClick={handleAmbientStop}
        >
          ⏹️ Stop
        </button>
      </div>
      <Spacer size='m' />
    </>
  );
  );
}

SoundSettings.displayName = 'SoundSettings';
