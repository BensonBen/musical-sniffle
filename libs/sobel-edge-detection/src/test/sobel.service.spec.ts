import * as sharp from 'sharp';
import { SobelService } from '../lib/sobel.service';

describe('Sobel Service Test Suite.', () => {
  let sobelService: SobelService = new SobelService();
  const warning = jest.fn();
  console.warn = warning;

  beforeEach(() => {
    sobelService = new SobelService();
  });

  afterEach(() => {
    warning.mockReset();
  });

  describe.skip('It should test bad inputs.', () => {
    it('Should prevent bad input by undefined.', () => {
      const result = sobelService.applySobel(undefined);
      expect(result?.imageData).toStrictEqual(new Uint8ClampedArray([]));
      expect(result?.thetas).toStrictEqual([]);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `Provide ImageData. Received: ${undefined}.`
      );
    });

    it('Should prevent bad input by null.', () => {
      const result = sobelService.applySobel(null);
      expect(result?.imageData).toStrictEqual(new Uint8ClampedArray([]));
      expect(result?.thetas).toStrictEqual([]);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `Provide ImageData. Received: ${null}.`
      );
    });

    it('Should prevent bad input by width.', () => {
      const input = new Uint8ClampedArray([]);
      const result = sobelService.applySobel(input, 1, -1);
      expect(result?.imageData).toStrictEqual(new Uint8ClampedArray([]));
      expect(result?.thetas).toStrictEqual([]);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `Provide valid ImageData containing valid width and height. Received width: ${1} height: ${-1}.`
      );
    });

    it('Should prevent bad input by height as number.', () => {
      const input = new Uint8ClampedArray([]);
      const result = sobelService.applySobel(input, -1, 1);
      expect(result?.imageData).toStrictEqual(new Uint8ClampedArray([]));
      expect(result?.thetas).toStrictEqual([]);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `Provide valid ImageData containing valid width and height. Received width: ${-1} height: ${1}.`
      );
    });
  });

  // TODO: remove this and port this into the how to use section.
  // describe('It should test pixel lookup correctly of all pixels.', () => {
  //   describe('It should check the left hand side of the image, or x = 0.', () => {
  //     it('x = 0, y = 0', async () => {
  //       const { data, info } = await sharp(
  //         `${__dirname}/non-max-second-quadrant-inverse.png`
  //       )
  //         .ensureAlpha()
  //         .grayscale()
  //         .raw()
  //         .toBuffer({ resolveWithObject: true });
  //       const { width, channels, height } = info;
  //       const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
  //       // const expectedGrayscaleColor = 124;
  //       const { imageData: detected } = (sobelService as any).applySobel(
  //         singleChannelGrayscalePixels,
  //         width,
  //         height,
  //         channels
  //       );
  //       const imagename = `${__dirname}/${nanoid()}.png`;
  //       await sharp(detected, { raw: { channels: 4, height, width } }).toFile(
  //         imagename
  //       );
  //     });
  //   });
  // });

  describe('It should test pixel lookup correctly of all pixels.', () => {
    describe('It should check the left hand side of the image, or x = 0.', () => {
      it('x = 0, y = 0', async () => {
        const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
          .ensureAlpha()
          .grayscale()
          .raw()
          .toBuffer({ resolveWithObject: true });
        const { width, channels, height } = info;
        const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
        const expectedGrayscaleColor = 124;
        const color = (sobelService as any)?.pixelLookup(
          0,
          0,
          width,
          height,
          singleChannelGrayscalePixels,
          channels
        );
        expect(color).toBe(expectedGrayscaleColor);
      });

      it('x = 0, y = 1', async () => {
        const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
          .ensureAlpha()
          .grayscale()
          .raw()
          .toBuffer({ resolveWithObject: true });
        const { width, channels, height } = info;
        const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
        const expectedGrayscaleColor = 204;
        const color = (sobelService as any)?.pixelLookup(
          0,
          1,
          width,
          height,
          singleChannelGrayscalePixels,
          channels
        );
        expect(color).toBe(expectedGrayscaleColor);
      });

      it('x = 1, y = 2', async () => {
        const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
          .ensureAlpha()
          .grayscale()
          .raw()
          .toBuffer({ resolveWithObject: true });

        const { width, channels, height } = info;
        const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
        const expectedGrayscaleColor = 165;
        const color = (sobelService as any)?.pixelLookup(
          0,
          2,
          width,
          height,
          singleChannelGrayscalePixels,
          channels
        );
        expect(color).toBe(expectedGrayscaleColor);
      });
    });
  });

  describe('It should check the middle of the image, or x = 1.', () => {
    it('x = 1, y = 0', async () => {
      const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
        .ensureAlpha()
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const { width, channels, height } = info;

      const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
      const expectedGrayscaleColor = 145;
      const color = (sobelService as any)?.pixelLookup(
        1,
        0,
        width,
        height,
        singleChannelGrayscalePixels,
        channels
      );
      expect(color).toBe(expectedGrayscaleColor);
    });

    it('x = 1, y = 1', async () => {
      const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
        .ensureAlpha()
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const { width, channels, height } = info;

      const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
      const expectedGrayscaleColor = 221;
      const color = (sobelService as any)?.pixelLookup(
        1,
        1,
        width,
        height,
        singleChannelGrayscalePixels,
        channels
      );
      expect(color).toBe(expectedGrayscaleColor);
    });

    it('x = 1, y = 2', async () => {
      const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
        .ensureAlpha()
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const { width, channels, height } = info;

      const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
      const expectedGrayscaleColor = 219;
      const color = (sobelService as any)?.pixelLookup(
        1,
        2,
        width,
        height,
        singleChannelGrayscalePixels,
        channels
      );
      expect(color).toBe(expectedGrayscaleColor);
    });
  });

  describe('It should check the middle of the image, or x = 2.', () => {
    it('x = 2, y = 0', async () => {
      const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
        .ensureAlpha()
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const { width, channels, height } = info;

      const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
      const expectedGrayscaleColor = 96;
      const color = (sobelService as any)?.pixelLookup(
        2,
        0,
        width,
        height,
        singleChannelGrayscalePixels,
        channels
      );
      expect(color).toBe(expectedGrayscaleColor);
    });

    it('x = 2, y = 1', async () => {
      const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
        .ensureAlpha()
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const { width, channels, height } = info;

      const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
      const expectedGrayscaleColor = 243;
      const color = (sobelService as any)?.pixelLookup(
        2,
        1,
        width,
        height,
        singleChannelGrayscalePixels,
        channels
      );
      expect(color).toBe(expectedGrayscaleColor);
    });

    it('x = 2, y = 2', async () => {
      const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
        .ensureAlpha()
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const { width, channels, height } = info;

      const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
      const expectedGrayscaleColor = 143;
      const color = (sobelService as any)?.pixelLookup(
        2,
        2,
        width,
        height,
        singleChannelGrayscalePixels,
        channels
      );
      expect(color).toBe(expectedGrayscaleColor);
    });
  });

  describe('It should correctly lookup pixels out of bounds and return 0.', () => {
    it('x = 0, y = -1', async () => {
      const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
        .ensureAlpha()
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const { width, channels, height } = info;

      const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
      const expectedGrayscaleColor = 0;
      const color = (sobelService as any)?.pixelLookup(
        -1,
        0,
        width,
        height,
        singleChannelGrayscalePixels,
        channels
      );
      expect(color).toBe(expectedGrayscaleColor);
    });

    it('x = 1, y = -1', async () => {
      const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
        .ensureAlpha()
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
      const expectedGrayscaleColor = 0;
      const { width, channels, height } = info;

      const color = (sobelService as any)?.pixelLookup(
        -1,
        0,
        width,
        height,
        singleChannelGrayscalePixels,
        channels
      );
      expect(color).toBe(expectedGrayscaleColor);
    });

    it('x = 2, y = -1', async () => {
      const { data, info } = await sharp(`${__dirname}/pixel_lookup_test.png`)
        .ensureAlpha()
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const { width, channels, height } = info;

      const singleChannelGrayscalePixels = new Uint8ClampedArray(data.buffer);
      const expectedGrayscaleColor = 0;
      const color = (sobelService as any)?.pixelLookup(
        -1,
        0,
        width,
        height,
        singleChannelGrayscalePixels,
        channels
      );
      expect(color).toBe(expectedGrayscaleColor);
    });
  });
  describe('It should test Kernel Convulution.', () => {
    const pixelArray = new Uint8ClampedArray([
      124, 145, 96, 204, 221, 243, 165, 219, 143,
    ]);
    it('x = 0, y = 0 convulution X test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelX(
        0,
        0,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(511);
    });

    it('x = 0, y = 0 convulution Y test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelY(
        0,
        0,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(629);
    });

    it('x = 1, y = 0 convulution X test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelX(
        1,
        0,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(-17);
    });

    it('x = 1, y = 0 convulution Y test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelY(
        1,
        0,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(889);
    });

    it('x = 2, y = 0 convulution X test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelX(
        2,
        0,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(-511);
    });

    it('x = 2, y = 0 convulution Y test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelY(
        2,
        0,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(707);
    });

    it('x = 0, y = 1 convulution X test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelX(
        0,
        1,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(806);
    });

    it('x = 0, y = 1 convulution Y test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelY(
        0,
        1,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(156);
    });

    it('x = 1, y = 1 convulution X test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelX(
        1,
        1,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(28);
    });

    it('x = 1, y = 1 convulution Y test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelY(
        1,
        1,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(236);
    });

    it('x = 2, y = 1 convulution X test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelX(
        2,
        1,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(-806);
    });

    it('x = 2, y = 1 convulution Y test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelY(
        2,
        1,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(168);
    });

    // here.
    it('x = 0, y = 2 convulution X test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelX(
        0,
        2,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(659);
    });

    it('x = 0, y = 2 convulution Y test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelY(
        0,
        2,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(-629);
    });

    it('x = 1, y = 2 convulution X test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelX(
        1,
        2,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(-5);
    });

    it('x = 1, y = 2 convulution Y test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelY(
        1,
        2,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(-889);
    });

    it('x = 2, y = 2 convulution X test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelX(
        2,
        2,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(-659);
    });

    it('x = 2, y = 2 convulution Y test.', () => {
      const magnitude = (sobelService as any).convoluteUsingKernelY(
        2,
        2,
        3,
        3,
        pixelArray,
        1
      );
      expect(magnitude).toStrictEqual(-707);
    });
  });
});
