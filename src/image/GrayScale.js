import math from 'mathjs';

export default class GrayScale {

    /**
     * https://en.wikipedia.org/wiki/Luma_(video) (most digital standard definition formats)
     * Y′ = 0.2989 R′ + 0.5870 G′ + 0.1140 B′.
     *
     * TODO math.js를 사용하여 매트릭스 기반 연산으로 바꾸어야 한다. 워커 도입도 검토하여 보자. 큰 이미지를 대상으로 연산 시작 측정도 해보자.
     */

    static toRGBA(pixels, width, height) {
        var resultPixels = new Uint8ClampedArray(pixels.length);

        var p = 0;
        var w = 0;

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var value = pixels[w] * 0.299 + pixels[w + 1] * 0.587 + pixels[w + 2] * 0.114;
                //var value = (pixels[w] * 4899 + pixels[w + 1] * 9617 + pixels[w + 2] * 1868 + 8192) >> 14;
                resultPixels[p++] = value;
                resultPixels[p++] = value;
                resultPixels[p++] = value;
                resultPixels[p++] = pixels[w + 3];

                w += 4;
            }
        }
        return resultPixels;
    }

    /*
    static toRGBAByMatrix(pixels, width, height) {
        console.log("pixels.length ==> " + pixels.length);

        //동작하지 않는 코드다...
        var rgbaMatrix = math.reshape(pixels, pixels.length / 4, 4);

        console.log(rgbaMatrix);

        var basis = [
            [0.299, 0.587, 0.114, 0],
            [0.299, 0.587, 0.114, 0],
            [0.299, 0.587, 0.114, 0],
            [0, 0, 0, 1]
        ];

        var grayMatrix = math.multiply(rgbaMatrix, basis);

        return resultPixels;
    }
    */
}