function Seam() {
    this.desaturateShader = new Shader(null, '\
        uniform sampler2D texture;\
        varying vec2 texCoord;\
        \
        void main() {\
            vec3 color = texture2D(texture, texCoord).rgb;\
            float c = (299.0 * color.x + 587.0 * color.y + 114.0 * color.z) / 1000.0;\
            gl_FragColor = vec4(vec3(c), 1.0);\
        }\
    ');
    
    this.sobelShader = new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        \
        void main() {\
            vec2 dx = vec2(1.0 / texSize.x, 0.0);\
            vec2 dy = vec2(0.0, 1.0 / texSize.y);\
            \
            float topLeft = texture2D(texture, texCoord + dx * -1.0 + dy * -1.0).r;\
            float topMiddle = texture2D(texture, texCoord + dy * -1.0).r;\
            float topRight = texture2D(texture, texCoord + dx * 1.0 + dy * -1.0).r;\
            \
            float bottomLeft = texture2D(texture, texCoord + dx * -1.0 + dy * 1.0).r;\
            float bottomMiddle = texture2D(texture, texCoord + dy * 1.0).r;\
            float bottomRight = texture2D(texture, texCoord + dx * 1.0 + dy * 1.0).r;\
            \
            float leftMiddle = texture2D(texture, texCoord + dx * -1.0).r;\
            float rightMiddle = texture2D(texture, texCoord + dx * -1.0).r;\
            \
            float sobelPixelV = (1.0 * topLeft + 2.0 * topMiddle + 1.0 * topRight - 1.0 * bottomLeft - 2.0 * bottomMiddle - 1.0 * bottomRight) / 4.0;\
            float sobelPixelH = (1.0 * topLeft + 2.0 * leftMiddle + 1.0 * bottomLeft - 1.0 * topRight - 2.0 * rightMiddle - 1.0 * bottomRight) / 4.0;\
            \
            float sobelResult = sqrt(sobelPixelV * sobelPixelV + sobelPixelH * sobelPixelH);\
            gl_FragColor = vec4(texture2D(texture, texCoord).r, vec2(sobelResult), 1.0);\
        }\
    ');
    
    slider(this, 'Size', 0, 200, 100, 1, function(value) {
        this.radius = value;
    });
}
Seam.prototype.name = 'Seam';
Seam.prototype.drawTo = function(original, texture) {
    var this_ = this;
    texture.drawTo(function() {
        original.use();
        this_.desaturateShader.drawRect();
    });
    texture.drawToUsingSelf(function() {
        texture.use();
        this_.sobelShader.uniforms({
            texSize: [texture.width, texture.height]
        }).drawRect();
    });
};
