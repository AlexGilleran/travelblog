import Relay from 'react-relay';

export default {
  blog: () => Relay.QL`query { blog }`,
};