import { ThetaMetadata } from './theta-metadata';

export class SobelService {
  private static readonly kernelX: Array<Readonly<Array<Readonly<number>>>> = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];

  private static readonly kernelY: Array<Readonly<Array<Readonly<number>>>> = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];

  private static readonly badInput = {
    imageData: new Uint8ClampedArray([]),
    thetas: [],
  };

  /**
   * Applies sobel's algorithm to the supplied raw image data and returns a derivative of the original.
   * 
   * @param imageData, grayscaled raw image data.
   * @param width, non-zero indexed width of the image.
   * @param height, non-zero index height of the image.
   * @param channel, number of channels of the raw image data.
   * @returns, contains image with sobel edge detection applied and meta data containing the x, y and theta of every pixel.
   */
  applySobel(
    imageData: Uint8ClampedArray | undefined | null,
    width: number = 0,
    height: number = 0,
    channel: 1 | 2 | 3 | 4 = 1
  ): {
    imageData: Uint8ClampedArray;
    thetas: Array<ThetaMetadata>;
  } {
    const transformedSobelImage: Array<number> = [];
    const thetas: Array<ThetaMetadata> = [];

    if (imageData == null) {
      console.warn(`Provide ImageData. Received: ${imageData}.`);
      return SobelService.badInput;
    } else if (width <= 0 || height <= 0 || width == null || height == null) {
      console.warn(
        `Provide valid ImageData containing valid width and height. Received width: ${width} height: ${height}.`
      );
      return SobelService.badInput;
    } else if (![1, 2, 3, 4].some((c) => c === channel)) {
      console.warn(
        `Provide channel, either 1, 2, 3 or 4. Received channel: ${channel}.`
      );
      return SobelService.badInput;
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const gX = this.convoluteUsingKernelX(
          x,
          y,
          width,
          height,
          imageData,
          channel
        );
        const gY: number = this.convoluteUsingKernelY(
          x,
          y,
          width,
          height,
          imageData,
          channel
        );
        const magnitude = Math.floor(
          Math.sqrt(Math.pow(gX, 2) + Math.pow(gY, 2))
        );
        const theta = Math.atan2(gY, gX);
        transformedSobelImage.push(magnitude, magnitude, magnitude, 255);
        thetas.push({ x, y, theta });
      }
    }

    return {
      imageData: new Uint8ClampedArray(transformedSobelImage),
      thetas,
    };
  }

  /**
   *
   * @param x, coordinate of the pixel in the x direction.
   * @param y, coordinate of the pixel in the y direction.
   * @param width, bounding width of the image (not zero indexed).
   * @param height, bounding height of the image (not zero indexed).
   * @param data, unsigned clamped contigious array containing the image data. Either in 1, 2, 3, 4 channels.
   * @param channel, the number of channels of the image. grayscale is typically 1 and rgba is 4.
   * @returns, convuluted pixel using kernel in the Y direction.
   */
  private readonly convoluteUsingKernelX = (
    x: number,
    y: number,
    width: number,
    height: number,
    data: Uint8ClampedArray,
    channel: 1 | 2 | 3 | 4
  ): number => {
    return (
      -this.pixelLookup(x - 1, y - 1, width, height, data, channel) +
      this.pixelLookup(x + 1, y - 1, width, height, data, channel) +
      SobelService.kernelX[1][0] *
        this.pixelLookup(x - 1, y, width, height, data, channel) +
      SobelService.kernelX[1][2] *
        this.pixelLookup(x + 1, y, width, height, data, channel) +
      -this.pixelLookup(x - 1, y + 1, width, height, data, channel) +
      this.pixelLookup(x + 1, y + 1, width, height, data, channel)
    );
  };

  /**
   *
   * @param x, coordinate of the pixel in the x direction.
   * @param y, coordinate of the pixel in the y direction.
   * @param width, bounding width of the image (not zero indexed).
   * @param height, bounding height of the image (not zero indexed).
   * @param data, unsigned clamped contigious array containing the image data. Either in 1, 2, 3, 4 channels.
   * @param channel, the number of channels of the image. grayscale is typically 1 and rgba is 4.
   * @returns, convuluted pixel using kernel in the Y direction.
   */
  private readonly convoluteUsingKernelY = (
    x: number,
    y: number,
    width: number,
    height: number,
    data: Uint8ClampedArray,
    channel: 1 | 2 | 3 | 4
  ): number => {
    return (
      -this.pixelLookup(x - 1, y - 1, width, height, data, channel) +
      SobelService.kernelY[0][1] *
        this.pixelLookup(x, y - 1, width, height, data, channel) +
      -this.pixelLookup(x + 1, y - 1, width, height, data, channel) +
      this.pixelLookup(x - 1, y + 1, width, height, data, channel) +
      SobelService.kernelY[2][1] *
        this.pixelLookup(x, y + 1, width, height, data, channel) +
      this.pixelLookup(x + 1, y + 1, width, height, data, channel)
    );
  };

  /**
   * Treats the pixel lookup as if it were the way a computer monitor draws graphics.
   *
   * @param x, coordinate of the pixel in the x direction.
   * @param y, coordinate of the pixel in the y direction.
   * @param width, bounding width of the image (not zero indexed).
   * @param height, bounding height of the image (not zero indexed).
   * @param data, unsigned clamped contigious array containing the image data. Either in 1, 2, 3, 4 channels.
   * @param channel, the number of channels of the image. grayscale is typically 1 and rgba is 4.
   * @returns, the pixel at the specified location else 0.
   */
  public readonly pixelLookup = (
    x: number,
    y: number,
    width: number,
    height: number,
    data: Uint8ClampedArray,
    channel: 1 | 2 | 3 | 4
  ) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return 0;
    }
    return data[(width * y + x) * channel];
  };
}
