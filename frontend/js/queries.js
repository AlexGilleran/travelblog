import Relay from 'react-relay';

export const blog = () => Relay.QL`query { blog(blogId: $blogId) }`;
export const entry = () => Relay.QL`query { entry(entryId: $entryId) }`;
export const viewer = () => Relay.QL`query { viewer }`;