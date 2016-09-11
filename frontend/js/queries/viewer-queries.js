import Relay from 'react-relay';

export default {
  home: () => Relay.QL`query { home }`,
};