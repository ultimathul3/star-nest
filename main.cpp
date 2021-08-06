#include <SFML/Graphics.hpp> 

int main()
{
    sf::RenderWindow window(sf::VideoMode::getFullscreenModes()[0], "Star nest", sf::Style::Fullscreen);

    sf::Texture texture;
    texture.create(window.getSize().x, window.getSize().y);
    sf::Sprite sprite(texture);

    sf::Shader shader;
    shader.loadFromFile("shader.frag", sf::Shader::Fragment);
    shader.setUniform("resolution", sf::Glsl::Vec2(window.getSize()));
    
    sf::Clock clock;
    float zoom = 2.9;
    float newZoom = zoom;
    
    while (window.isOpen()) 
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed || event.type == sf::Event::KeyPressed && event.key.code == sf::Keyboard::Escape) 
                window.close();
            else if (event.type == sf::Event::MouseWheelScrolled)
                newZoom -= (event.mouseWheelScroll.delta == 1) ? 0.40 : -0.40;
        }

        if (zoom < newZoom)
            zoom += 0.1;
        if (zoom > newZoom)
            zoom -= 0.1;

        sf::Vector2i mousePos = sf::Mouse::getPosition(window);
        shader.setUniform("time", clock.getElapsedTime().asSeconds());
        shader.setUniform("mouse", sf::Glsl::Vec2(mousePos));
        shader.setUniform("zoom", zoom);
        
        window.clear();
        window.draw(sprite, &shader);
        window.display();
    }

    return 0;
}
