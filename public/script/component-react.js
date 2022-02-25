define('react-component', ['react', 'react-dom', 'Utils'],
    function (React, ReactDom, Utils) {
        class LanguageBar extends React.Component {
            constructor(props) {
                super(props);
                this.state = { lang: Utils.getDefaultLanguage() };
            }

            
        }


        var talkingHeader = function () {
            return Component.prototype.tooltip = function (lang) {
                $(".con-tooltip").on("mouseenter", function () {
                    $(".con-tooltip .tooltip").html(dataUtils.Greetings[lang].random()).fadeIn(3000);;
                })
            }
        }
        class ShoppingList extends React.Component {
            render() {
                // return React.createElement('div', { className: 'shopping-list' },
                //     React.createElement('h1'),
                //     React.createElement('ul')
                // );
                return (
                   <div className="shopping-list">
                       <h1>Shopping List for {this.props.name}</h1>
                       <ul>
                           <li>Instagram</li>
                           <li>WhatsApp</li>
                           <li>Oculus</li>
                       </ul>
                   </div>
                );
            }
        }

        return { LanguageBar };
    });