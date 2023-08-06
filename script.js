const hamburgerNavMenu = document.getElementById("hamburger-nav-menu");

// Media query
const mediaQuery = window.matchMedia('(max-width: 800px)');

function FixResponsive(e)
{
    if (e.matches)
    {
        const wrapper = document.querySelector(".fade-wrapper.active");
        if (wrapper == null) return;
        const body = wrapper.children[0];
        body.classList.add("active");
        SelectVideo();
    }
    else
    {
        const body = document.querySelector("div.active");
        body.parentElement.classList.add("active");
    }
}

mediaQuery.addListener(FixResponsive);

const pieces = Array.from(document.querySelectorAll(".chess-piece"));
var currentSelectedPiece = 0;
const pieceNames = [ "King", "Queen", "Rook", "Bishop", "Knight", "Pawn" ];
const pieceVideos = 
[
    document.getElementById("king-video"),
    document.getElementById("queen-video"),
    document.getElementById("rook-video"),
    document.getElementById("bishop-video"),
    document.getElementById("knight-video"),
    document.getElementById("pawn-video"),
]
const pieceDescriptions = 
[ 
    "The king can only move 1 step in all directions.",
    "The queen can move in any direction as far as it wants. No jumping over pieces.",
    "Rooks can move only in horizontal and vertical directions, but can move as far as it wants.",
    "Bishops can move as far as it wants diagonally, no jumping over pieces.",
    "Knights, being the only piece that can jump over other pieces, moves in an L shape in all directions.",
    "Pawns can move one square forward, except for their first move where they can move two. They cannot move or capture backwards. They can only capture diagonally one step in front of them."
];
const pieceHeader = document.getElementById("piece-section-header");
const pieceDesc = document.getElementById("piece-description");
const pieceElementClassNames = 
[
    ".chess-board-king"  ,
    ".chess-board-queen" ,
    ".chess-board-rook"  ,
    ".chess-board-bishop",
    ".chess-board-knight",
    ".chess-board-pawn"  ,
];

const pieceElementStartingPositionClassNames = 
[
    ".king-starting-position"  ,
    ".queen-starting-position"  ,
    ".rook-starting-position"  ,
    ".bishop-starting-position"  ,
    ".knight-starting-position"  ,
    ".pawn-starting-position"  ,
];

const kingMovement =
[
    [0, 1],
    [1, 1],
    [-1, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
    [1, -1],
    [-1, -1],
];

const knightMovement = 
[
    [1, 2],
    [1, -2],
    [2, 1],
    [2, -1],
    [-1, 2],
    [-1, -2],
    [-2, 1],
    [-2, -1],
]

var pawnHasMoved = false;

function IsNumeric(str) {
    if (typeof str != "string") return false; 
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function InBounds(row, column)
{
    return row >= 1 && row <= 8 && column >= 1 && column <= 8;
}

function OnHamburgerMenuClick()
{
    hamburgerNavMenu.classList.toggle("open");
}

function SelectVideo()
{
    for (let i = 0; i < pieceVideos.length; ++i)
    {
        pieceVideos[i].style.display = i == currentSelectedPiece ? "block" : "none";
    }
}

function ResetPositions()
{
    document.querySelectorAll(".chess-board-indicator.active").forEach(i => i.classList.remove("active"));
    const selected = document.querySelector(".selected");
    if (selected != null)
        selected.classList.remove("selected");
    pawnHasMoved = false;
    var pieceElements = [];
    var pieceStartingElements = [];
    for (let i = 0; i < pieceElementClassNames.length; ++i)
    {
        pieceElements.push(document.querySelector(pieceElementClassNames[i]));
        pieceStartingElements.push(document.querySelector(pieceElementStartingPositionClassNames[i]));
    }

    for (let i = 0; i < pieceElements.length; ++i)
    {
        if (pieceStartingElements[i] == null || pieceElements[i] == null) continue;
        console.log(pieceElements[i]);
        // while (pieceElements[i].childNodes.length > 0)
        // {
        //     pieceStartingElements[i].appendChild(pieceElements[i].childNodes[0]);
        // }
        pieceStartingElements[i].appendChild(pieceElements[i]);
        const piece = pieceElements[i];
        const row = piece.parentElement.parentElement.id.slice(4);
        const rowElement = piece.parentElement.parentElement;
        const column = Array.prototype.indexOf.call(rowElement.children, piece.parentElement);
        for (let i = 0; i < piece.classList.length; ++i)
        {
            if (IsNumeric(piece.classList.item(i)))
            {
                piece.classList.remove(piece.classList.item(i));
                i--;
            }
        }

        var newClassList = Array.from(piece.classList);
        newClassList.unshift(row + column.toString());
        piece.className = "";
        for (let i = 0; i < newClassList.length; ++i)
        {
            piece.classList.add(newClassList[i]);
        }
    }
}

function UpdateChessBoardOnSelect(reset = true)
{
    if (reset)
    {
        ResetPositions();
    }

    SelectVideo();
    var pieceElements = [];
    for (let i = 0; i < pieceElementClassNames.length; ++i)
    {
        pieceElements.push(document.querySelector(pieceElementClassNames[i]));
    }

    for (let i = 0; i < pieceElements.length; ++i)
    {
        if (pieceElements[i] != null)
        {
            pieceElements[i].style.display = 'none';
        }
    }
    if (pieceElements[currentSelectedPiece] != null)
    {
        pieceElements[currentSelectedPiece].style.display = 'inline'
    }
}

function UpdatePieceSection()
{
    pieceHeader.textContent = pieceNames[currentSelectedPiece];
    pieceDesc.textContent = pieceDescriptions[currentSelectedPiece];

    UpdateChessBoardOnSelect();

    for (let i = 0; i < pieces.length; ++i)
    {
        if (i == currentSelectedPiece)
        {
            pieces[i].style.display = 'block';
            continue;
        }
        pieces[i].style.display = 'none';
    }
}

function SelectPieceOnLeft()
{
    if (currentSelectedPiece == 0)
    {
        currentSelectedPiece = pieces.length - 1;
    }
    else
    {
        currentSelectedPiece--;
    }
    UpdatePieceSection();
}

function SelectPieceOnRight()
{
    if (currentSelectedPiece == pieces.length - 1)
    {
        currentSelectedPiece = 0; 
    }
    else
    {
        currentSelectedPiece++;
    }
    UpdatePieceSection();
}

function Reveal()
{
    var reveals = document.querySelectorAll(".reveal-on-scroll");
    const windowHeight = window.innerHeight;
    for (var i = 0; i < reveals.length; ++i)
    {
        // Get top of the element
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisibleThreshold = 150;

        // Check if the user has reached the visible threshold
        if (elementTop < windowHeight - elementVisibleThreshold)
        {
            reveals[i].classList.add("active");
        }
        else
        {
            reveals[i].classList.remove("active");
        }
    }
}

function GoToOpenings()
{
    const openings = document.getElementById("openings-page");
    const allActive = document.querySelectorAll(".active");
    if (!mediaQuery.matches)
    {
        if (openings.parentElement.classList.contains("active"))
        {
            return;
        }

        const allActive = document.querySelectorAll(".active");
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        setTimeout(function()
        {
            openings.parentElement.classList.add("active");
        }, 600);
        // setTimeout(function()
        // {
        //     history.parentElement.classList.add("active");
        // }, 200);
    }
    else
    {
        const allActive = document.querySelectorAll(".active");
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        openings.parentElement.classList.add("active");
    }
}

function GoToHistory()
{
    const history = document.getElementById("history-page");
    const allActive = document.querySelectorAll(".active");
    if (!mediaQuery.matches)
    {
        if (history.parentElement.classList.contains("active"))
        {
            return;
        }

        const allActive = document.querySelectorAll(".active");
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        setTimeout(function()
        {
            history.parentElement.classList.add("active");
        }, 600);
        // setTimeout(function()
        // {
        //     history.parentElement.classList.add("active");
        // }, 200);
    }
    else
    {
        const allActive = document.querySelectorAll(".active");
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        history.parentElement.classList.add("active");
    }
}

function GoToRules()
{
    const about = document.querySelector("#about-body");
    const rules = document.querySelector("#rules-body");

    // If rules is already active, early return.
    if (rules.parentElement.classList.contains("active")) return;

    const allActive = document.querySelectorAll(".fade-wrapper.active");
    // setTimeout(function()
    // {
    //     for (let i = 0; i < allActive.length; ++i)
    //     {
    //         allActive[i].classList.remove("active");
    //     }
    // }, 990);


    if (!mediaQuery.matches)
    {
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
            // setTimeout(function(){
            //     if (allActive[i].children[0].classList.contains("active"))
            //     allActive[i].children[0].classList.remove("active");

            // }, 200);
        }
        UpdateChessBoardOnSelect(); 
        setTimeout(function()
        {
            rules.parentElement.classList.add("active");
            // rules.classList.add("active");
        }, 500);
    }
    else
    {
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        rules.parentElement.classList.add("active");
        rules.classList.add("active");
    }
}

function GoToHome()
{
    const home = document.getElementById("about-body");
    const allActive = document.querySelectorAll(".active");

    if (!mediaQuery.matches)
    {
        if (home.parentElement.classList.contains("active"))
        {
            return;
        }

        const allActive = document.querySelectorAll(".active");
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        setTimeout(function()
        {
            home.parentElement.classList.add("active");
        }, 600);

    }
    else
    {
        const allActive = document.querySelectorAll(".active");
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        home.parentElement.classList.add("active");
    }

}

function OnQueenClick(button)
{
    console.log("test");
    ButtonSelect(button);

    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow + i;
        const column = currentColumn;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow - i;
        const column = currentColumn;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow;
        const column = currentColumn + i;
        if (InBounds(row, column))
        {
            console.log("test");
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow;
        const column = currentColumn - i;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow + i;
        const column = currentColumn + i;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow - i;
        const column = currentColumn + i;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow - i;
        const column = currentColumn - i;
        if (InBounds(row, column))
        {
            console.log("test");
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow + i;
        const column = currentColumn - i;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

}

function OnRookClick(button)
{
    ButtonSelect(button);

    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow + i;
        const column = currentColumn;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow - i;
        const column = currentColumn;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow;
        const column = currentColumn + i;
        if (InBounds(row, column))
        {
            console.log("test");
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow;
        const column = currentColumn - i;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }
}

function OnBishopClick(button)
{
    ButtonSelect(button);

    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow + i;
        const column = currentColumn + i;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow - i;
        const column = currentColumn + i;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow - i;
        const column = currentColumn - i;
        if (InBounds(row, column))
        {
            console.log("test");
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }

    for (let i = 1; i < 8; ++i)
    {
        const row = currentRow + i;
        const column = currentColumn - i;
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
        else
        {
            break;
        }
    }
}

function OnKingClick(button)
{
    ButtonSelect(button);

    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);

    for (let i = 0; i < kingMovement.length; ++i)
    {
        const row = currentRow + kingMovement[i][0];
        const column = currentColumn + kingMovement[i][1];
        // console.log(row + ", ", column);
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
    }
}

function OnKnightClick(button)
{
    ButtonSelect(button);

    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);
    // console.log(button.classList);

    for (let i = 0; i < knightMovement.length; ++i)
    {
        const row = currentRow + knightMovement[i][0];
        const column = currentColumn + knightMovement[i][1];
        // console.log(row + ", ", column);
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
    }

}

function GetIndicator(row, column)
{
    const nextRowElement = document.getElementById("row-".concat(row.toString()));
    const nextElement = nextRowElement.children.item(column);
    return nextElement.querySelector(".chess-board-indicator");
}

function ButtonSelect(button)
{
    if (!button.classList.contains("selected"))
        document.querySelectorAll(".selected").forEach(s => s.classList.remove("selected"));
    button.classList.toggle("selected");
}

function OnPawnClick(button)
{
    ButtonSelect(button);
    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);
    console.log(button.classList[0]);

    if (currentRow < 8)
    {
        currentRow++;
    }

    GetIndicator(currentRow, currentColumn).classList.toggle("active");

    if (!pawnHasMoved)
    {
        GetIndicator(currentRow + 1, currentColumn).classList.toggle("active");
    }
}

function OnIndicatorClick(indicator)
{
    const pieces = document.querySelectorAll(".selected");
    if (pieces.length == 0)
    {
        return;
    }

    const row = indicator.parentElement.parentElement.id.slice(4);
    const rowElement = indicator.parentElement.parentElement;
    const column = Array.prototype.indexOf.call(rowElement.children, indicator.parentElement);

    const piece = pieces[0];

    if (!pawnHasMoved && piece.classList.contains("chess-board-pawn"))
    {
        pawnHasMoved = true;
    }

    indicator.parentElement.appendChild(piece);
    // piece.parentElement.removeChild(piece);
    // piece.parentElement.innerHTML = piece.parentElement.innerHTML.slice(piece.outerHTML.length);
    const piecesAfter = document.querySelectorAll(".selected");
    if (piecesAfter != null && piecesAfter.length > 0)
    {
        piecesAfter[0].classList.remove("selected");
    }
    document.querySelectorAll(".chess-board-indicator.active").forEach(i => i.classList.remove("active"));


    // Clear the two numbers that indicate position
    for (let i = 0; i < piece.classList.length; ++i)
    {
        if (IsNumeric(piece.classList.item(i)))
        {
            piece.classList.remove(piece.classList.item(i));
            i--;
        }
    }

    // var pieceClassList = piecesAfter[0].classList;
    // pieceClassList.unshift(row, column.toString());
    // piecesAfter[0].classList = pieceClassList;
    var newClassList = Array.from(piece.classList);
    newClassList.unshift(row + column.toString());
    piece.className = "";
    for (let i = 0; i < newClassList.length; ++i)
    {
        piece.classList.add(newClassList[i]);
    }


}


const quizResult = document.getElementById("quiz-result");
function GetResults()
{
    var italian = document.getElementById("italian");
    var sicilian = document.getElementById("sicilian");
    var french = document.getElementById("french");

    if (sicilian.checked)
    {
        quizResult.textContent = "You are correct!";
        quizResult.style.color = "var(--green)";
    }
    else
    {
        if (!italian.checked && !french.checked) return;
        quizResult.textContent = "You are wrong!";
        quizResult.style.color = "var(--red)";
    }
}


window.addEventListener("scroll", Reveal);
Reveal();
UpdateChessBoardOnSelect();








