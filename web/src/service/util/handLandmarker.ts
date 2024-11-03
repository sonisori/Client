import {
  FilesetResolver,
  HandLandmarker as MediapipeHandLandmarker,
} from "@mediapipe/tasks-vision";

class HandLandmarker {
  private handLandmarker: MediapipeHandLandmarker | undefined;
  close() {
    if (this.handLandmarker) {
      this.handLandmarker.close();
    }
  }
  detectForVideo(video: HTMLVideoElement, time: number) {
    if (!this.handLandmarker) {
      throw new Error("HandLandmarker is not initialized");
    }
    return this.handLandmarker.detectForVideo(video, time);
  }
  async initialize() {
    if (!this.handLandmarker) {
      console.log("load new handLandmarker");
      const vision = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
      this.handLandmarker = await MediapipeHandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "/mediapipe/model/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        },
      );
    }
    await this.handLandmarker.setOptions({
      runningMode: "VIDEO",
    });
  }
}

export const handLandmarker = new HandLandmarker();
