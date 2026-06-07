import getHandler from './getHandler.js';
import hasHandler from './hasHandler.js';
import ownKeysHandler from './ownKeysHandler.js';
import setHandler from './setHandler.js';
import deleteProperty from './deleteProperty.js';
export default {
    get: getHandler,
    has: hasHandler,
    ownKeys: ownKeysHandler,
    set: setHandler,
    deleteProperty: deleteProperty
}