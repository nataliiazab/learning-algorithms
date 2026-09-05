import SortVisualizer from './SortVisualizer';
import SearchVisualizer from './SearchVisualizer';
import WindowVisualizer from './WindowVisualizer';

// Add a new `case` here whenever a new algorithm `type` needs its own
// visual representation (e.g. 'graph', 'linked-list', 'tree'...).
export function getVisualizer(type) {
  switch (type) {
    case 'search':
      return SearchVisualizer;
    case 'window':
      return WindowVisualizer;
    case 'sort':
    default:
      return SortVisualizer;
  }
}
