import {EventEmitter} from 'events';

const eventEmitter = new EventEmitter()
EventEmitter.setMaxListeners(1)


export default eventEmitter