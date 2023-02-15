class Animation {
  constructor(frameSize, frames, loop, ticksPerFrame) {
    this.frameSize = frameSize;
    this.frames = frames -1;
    this.loop = loop;
    this.ticksPerFrame = ticksPerFrame;
    this.frame = 0;
    this.ticks = 0;
  }
  nextFrame(){
    if(this.ticks < this.ticksPerFrame){
      this.ticks++;
    } else {
      this.ticks = 0;
      if(this.frame == this.frames){
        if(this.loop){
          this.frame = 0;
        }
      } else {
        this.frame++;
      }
    }
  }
  returnImageSection(){
    return {x: this.frameSize.w * this.frame, y: 0, w: this.frameSize.w, h: this.frameSize.h};
  }
}
