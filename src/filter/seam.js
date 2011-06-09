function Seam() {
    this.shader = new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        vec4 desaturate(vec3 color) {\
            float c = (299.0 * color.x + 587.0 * color.y + 114.0 * color.z) / 1000.0;\
            return vec4(c,c,c,1.0);\
        }\
        void main() {\
            vec3 color = texture2D(texture, texCoord).rgb;\
            gl_FragColor = desaturate(color);\
        }\
    ');

    slider(this, 'Strength', 0, 1, 0.5, 0.01, function(value) {
        this.strength = value;
    });
}
Seam.prototype.name = 'Seam';
Seam.prototype.drawTo = function(original, texture) {
    var this_ = this;
    texture.drawTo(function() {
        original.use();
        this_.shader.uniforms({
            texSize: [original.width, original.height]
        }).drawRect();
    });
};
