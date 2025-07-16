
import React from 'react';
import { REALITY_GLITCH_DURATION_MS } from '../../constants';

// This component's main purpose is to be re-keyed to trigger CSS animations.
// It doesn't need props for its rendering logic if the key change handles re-animation.

const RealityGlitchEffect: React.FC = () => {
  return (
    <div
      className="reality-glitch-effect-container"
      style={{ '--reality-glitch-total-duration': `${REALITY_GLITCH_DURATION_MS}ms` } as React.CSSProperties}
    />
  );
};

export default RealityGlitchEffect;