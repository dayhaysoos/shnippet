import { MessagePort } from 'node:worker_threads';
import { C as ContextRPC } from './worker.BAlI9hII.js';

interface WorkerContext extends ContextRPC {
    port: MessagePort;
}

export type { WorkerContext as W };
