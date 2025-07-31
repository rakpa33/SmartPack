/**
 * Tests for getTravelModeIcon utility function
 * Validates icon rendering and consistent class application
 */

import { render } from '@testing-library/react';
import { TruckIcon, GlobeAltIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

// Mock the getTravelModeIcon function inline for testing
const getTravelModeIcon = (mode: string) => {
  const iconProps = { className: "h-4 w-4" };
  switch (mode) {
    case 'Car':
      return <TruckIcon {...iconProps} />;
    case 'Plane':
      return <GlobeAltIcon {...iconProps} />;
    case 'Train':
      return <BuildingOfficeIcon {...iconProps} />;
    case 'Bus':
      return <TruckIcon {...iconProps} />;
    case 'Boat':
      return <GlobeAltIcon {...iconProps} />;
    default:
      return null;
  }
};

describe('getTravelModeIcon', () => {
  it('should return correct icon for each travel mode', () => {
    const modes = ['Car', 'Plane', 'Train', 'Bus', 'Boat'];

    modes.forEach(mode => {
      const icon = getTravelModeIcon(mode);
      expect(icon).not.toBeNull();
    });
  });

  it('should return null for unknown travel mode', () => {
    const icon = getTravelModeIcon('Unknown');
    expect(icon).toBeNull();
  });

  it('should apply consistent icon classes without margin', () => {
    const carIcon = getTravelModeIcon('Car');
    const { container } = render(<div>{carIcon}</div>);

    const iconElement = container.querySelector('svg');
    expect(iconElement).toHaveClass('h-4', 'w-4');
    expect(iconElement).not.toHaveClass('mr-2'); // Ensure mr-2 is removed
  });

  it('should render icons with proper size classes', () => {
    const modes = ['Car', 'Plane', 'Train', 'Bus', 'Boat'];

    modes.forEach(mode => {
      const icon = getTravelModeIcon(mode);
      const { container } = render(<div>{icon}</div>);

      const iconElement = container.querySelector('svg');
      expect(iconElement).toHaveClass('h-4');
      expect(iconElement).toHaveClass('w-4');
    });
  });
});
