import FavButton from "./FavButton";


export default function Game({game, fav, setFav}) {

    function convertTextToHEX(text) {
        let hex = "";

        for (let i = 0; i < text.length; i++) {
            hex += text.charCodeAt(i).toString(16);
        }

        hex = (hex + "000000").slice(0, 6);

        return "#" + hex;
    }

    function invertColor(text) {
        let hex = convertTextToHEX(text)
        hex = hex.replace("#", "");

        const r = 255 - parseInt(hex.slice(0, 2), 16);
        const g = 255 - parseInt(hex.slice(2, 4), 16);
        const b = 255 - parseInt(hex.slice(4, 6), 16);

        return (
            "#" +
            r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            b.toString(16).padStart(2, "0")
        );
    }


    return (
        <div className="game" style={{backgroundColor: convertTextToHEX(game.name)}}>
            <FavButton game={game} selected={fav.map(n => n.id).includes(game.id)} setFav={setFav} />
            <p style={{color: invertColor(game.name)}}>{game.name}</p>
        </div>
    )

}