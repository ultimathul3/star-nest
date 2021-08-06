uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float zoom;

// Star Nest by Pablo Román Andrioli
// Modified a lot..

// This content is under the MIT License.

#define iterations 19
#define formuparam 0.516530

#define volsteps 15
#define stepsize 0.120

//#define zoom   2.900
#define tile   1.850
#define speed  0.0011

#define brightness 0.001215
#define darkmatter 0.6400
#define distfading 0.760
#define saturation 0.800


void main(void)
{
    // get coords and direction
    vec2 uv = gl_FragCoord.xy / resolution.xy - .5;
    uv.y *= resolution.y / resolution.x;
    vec3 dir = vec3(uv * zoom, 1.);
    
    float a2 = time * speed + .15;
    float a1 = 0.0;
    mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
    mat2 rot2 = rot1;
    dir.xz *= rot1;
    dir.xy *= rot2;
    
    vec3 from=vec3(0., 0., 0.);
    from += vec3(.01 * time, .01 * time, -2.);
    
    from.x += mouse.x / 5000.0;
    from.y -= mouse.y / 5000.0;
    
    from.xz *= rot1;
    from.xy *= rot2;
    
    // volumetric rendering
    float s = .4, fade = .2;
    vec3 v = vec3(0.4);
    
    for (int r = 0; r < volsteps; r++)
    {
        vec3 p= from + s * dir * .5;
        p = abs(vec3(tile) - mod(p, vec3(tile * 2.))); // tiling fold
        float pa, a = pa = 0.;
        
        for (int i = 0; i < iterations; i++)
        { 
            p = abs(p) / dot(p, p) - formuparam; // the magic formula
            a += abs(length(p) - pa); // absolute sum of average change
            pa = length(p);
        }
        
        float dm = max(0., darkmatter - a*a * .001); // dark matter
        a *= a*a*2.; // add contrast
        if (r > 3) fade *= 1. - dm; // dark matter, don't render near

        v += fade;
        v += vec3(s, s*s, s*s*s*s) * a * brightness * fade; // coloring based on distance
        fade *= distfading; // distance fading
        s += stepsize;
    }
    
    v = mix(vec3(length(v)), v, saturation); //color adjust
    gl_FragColor = vec4(v * .01, 1.);    
}