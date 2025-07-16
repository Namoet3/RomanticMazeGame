
import React from 'react';
import { LAST_STAND_ANIMATION_DURATION } from '../../constants';


const LastStandEffect: React.FC = () => {
  return (
    <div
      className="last-stand-flash-effect"
      style={{ '--last-stand-duration': `${LAST_STAND_ANIMATION_DURATION}ms` } as React.CSSProperties}
    ></div>
  );
};

export default LastStandEffect;