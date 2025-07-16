
import React from 'react';

interface DamageFlashScreenProps {
  trigger: number | null;
}

const DamageFlashScreen: React.FC<DamageFlashScreenProps> = ({ trigger }) => {
  if (!trigger) {
    return null;
  }

  return (
    <div
      key={trigger} // Using trigger as key to re-mount and re-play animation
      className="damage-flash-effect-screen"
    />
  );
};

export default DamageFlashScreen;