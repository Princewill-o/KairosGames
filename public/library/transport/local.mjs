import {createMatch,stepMatch,act} from '../engine.mjs';
export class LocalTransport{
 constructor(game,seed,members,age,matchId){this.state=createMatch(game,seed,members,age,matchId);this.inputs={};}
 send(id,intent){if(intent.type==='move')this.inputs[id]=intent;else this.state=act(this.state,id,intent);}
 step(dt){this.state=stepMatch(this.state,dt,this.inputs);return this.state;}
 disconnect(){this.inputs={};}
}
