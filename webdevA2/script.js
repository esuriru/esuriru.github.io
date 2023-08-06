// Hamburger nav menu
const hamburgerNavMenu = document.getElementById("hamburger-nav-menu");

// Media query
const mediaQuery = window.matchMedia('(max-width: 800px)');

function FixResponsive(e)
{
    if (e.matches)
    {
        // Mobile fixes.
        SelectVideo();
    }
}

// When media query changes, call fix responsive
mediaQuery.addListener(FixResponsive);

// get all the pieces on html file and convert to array.
const pieces = Array.from(document.querySelectorAll(".chess-piece"));
var currentSelectedPiece = 0;
const pieceNames = [ "King", "Queen", "Rook", "Bishop", "Knight", "Pawn" ];

// Videos for each piece in order of array pieceNames
const pieceVideos = 
[
    document.getElementById("king-video"),
    document.getElementById("queen-video"),
    document.getElementById("rook-video"),
    document.getElementById("bishop-video"),
    document.getElementById("knight-video"),
    document.getElementById("pawn-video"),
];

// Descriptions for each piece in order of array pieceNames
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

// Class names for pieces type
const pieceElementClassNames = 
[
    ".chess-board-king"  ,
    ".chess-board-queen" ,
    ".chess-board-rook"  ,
    ".chess-board-bishop",
    ".chess-board-knight",
    ".chess-board-pawn"  ,
];

// class name for piece's individual starting positions
const pieceElementStartingPositionClassNames = 
[
    ".king-starting-position"  ,
    ".queen-starting-position"  ,
    ".rook-starting-position"  ,
    ".bishop-starting-position"  ,
    ".knight-starting-position"  ,
    ".pawn-starting-position"  ,
];

// Movement values for king
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

// Movement values for knight
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
];

var pawnHasMoved = false;

// Numeric check
function IsNumeric(str) {
    if (typeof str != "string") return false; 
    return !isNaN(str) && !isNaN(parseFloat(str));
}

// In bounds check.
function InBounds(row, column)
{
    return row >= 1 && row <= 8 && column >= 1 && column <= 8;
}

// Hamburger menu toggle
function OnHamburgerMenuClick()
{
    hamburgerNavMenu.classList.toggle("open");
}

function SelectVideo()
{
    // Update the video based on current selected piece.
    for (let i = 0; i < pieceVideos.length; ++i)
    {
        pieceVideos[i].style.display = i == currentSelectedPiece ? "block" : "none";
    }
}

function ResetPositions()
{
    // Get all active indicators and then remove their active status.
    document.querySelectorAll(".chess-board-indicator.active").forEach(i => i.classList.remove("active"));

    // Get selected item and then remove its selected class.
    const selected = document.querySelector(".selected");
    if (selected != null)
        selected.classList.remove("selected");

    // Reset pawn movement.
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

        // Put the piece element back in where it belongs.
        pieceStartingElements[i].appendChild(pieceElements[i]);

        // Get the row and column of the indicator based on its position in the parent.
        const piece = pieceElements[i];
        const row = piece.parentElement.parentElement.id.slice(4); // 'row-x'
        const rowElement = piece.parentElement.parentElement;
        const column = Array.prototype.indexOf.call(rowElement.children, piece.parentElement);

        // Get all numbers from class list and remove them.
        for (let i = 0; i < piece.classList.length; ++i)
        {
            if (IsNumeric(piece.classList.item(i)))
            {
                piece.classList.remove(piece.classList.item(i));
                i--;
            }
        }

        // Prepend new position numbers into class list of the defaulted piece.
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

    // Select the video based on new piece.
    SelectVideo();
    var pieceElements = [];
    for (let i = 0; i < pieceElementClassNames.length; ++i)
    {
        pieceElements.push(document.querySelector(pieceElementClassNames[i]));
    }

    // Set all the piece elements to invisible.
    for (let i = 0; i < pieceElements.length; ++i)
    {
        if (pieceElements[i] != null)
        {
            pieceElements[i].style.display = 'none';
        }
    }

    // Set the current selected piece to visible.
    if (pieceElements[currentSelectedPiece] != null)
    {
        pieceElements[currentSelectedPiece].style.display = 'inline';
    }
}

// Update everything once a new piece has been selected. 
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

// Left Selector callback
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

// Right Selector callback
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

    // If openings is already active, early return.
    if (openings.parentElement.classList.contains("active"))
    {
        return;
    }

    // If on desktop, do transition
    if (!mediaQuery.matches)
    {
        const allActive = document.querySelectorAll(".active");
        // Scroll out first.
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        // After first transition done, do our requested transition 
        setTimeout(function()
        {
            openings.parentElement.classList.add("active");
        }, 600);
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
    // If history is already active, early return.
    if (history.parentElement.classList.contains("active"))
    {
        return;
    }
    // If on desktop, do transition
    if (!mediaQuery.matches)
    {
        const allActive = document.querySelectorAll(".active");
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        // After first transition done, do our requested transition 
        setTimeout(function()
        {
            history.parentElement.classList.add("active");
        }, 600);
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

    // If on desktop, do transition
    if (!mediaQuery.matches)
    {
        // Scroll out first.
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        UpdateChessBoardOnSelect(); 
        // After first transition done, do our requested transition 
        setTimeout(function()
        {
            rules.parentElement.classList.add("active");
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

    // If on desktop, do transition
    if (!mediaQuery.matches)
    {
        if (home.parentElement.classList.contains("active"))
        {
            return;
        }

        // Scroll out first.
        const allActive = document.querySelectorAll(".active");
        for (let i = 0; i < allActive.length; ++i)
        {
            allActive[i].classList.remove("active");
        }
        // After first transition done, do our requested transition 
        setTimeout(function()
        {
            home.parentElement.classList.add("active");
        }, 500);

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

    // Get current position
    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);

    // The reason why we want to use 8 is because in case they are in a corner, it would need to go to the end corner.
    // Not the most efficient solution but should be ok since we are breaking once 
    // they are out of bounds in said specific for loop
    // Queen is just bishop and rook combined.
    // Iterate through all possible relative positions and check if its in bounds, then set the indicators to active.

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

    // Get current position
    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);

    // The reason why we want to use 8 is because in case they are in a corner, it would need to go to the end corner.
    // Not the most efficient solution but should be ok since we are breaking once 
    // they are out of bounds in said specific for loop
    // Iterate through all possible relative positions and check if its in bounds, then set the indicators to active.

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

    // Get current position
    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);

    // The reason why we want to use 8 is because in case they are in a corner, it would need to go to the end corner.
    // Not the most efficient solution but should be ok since we are breaking once 
    // they are out of bounds in said specific for loop
    // Iterate through all possible relative positions and check if its in bounds, then set the indicators to active.
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
        // Iterate through all possible relative positions and check if its in bounds, then set the indicators to active.
        const row = currentRow + kingMovement[i][0];
        const column = currentColumn + kingMovement[i][1];
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
    }
}

function OnKnightClick(button)
{
    ButtonSelect(button);

    // Get current position from class list.
    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);

    for (let i = 0; i < knightMovement.length; ++i)
    {
        // Iterate through all possible relative positions and check if its in bounds, then set the indicators to active.
        const row = currentRow + knightMovement[i][0];
        const column = currentColumn + knightMovement[i][1];
        if (InBounds(row, column))
        {
            GetIndicator(row, column).classList.toggle("active");
        }
    }

}

function GetIndicator(row, column)
{
    // Get the indicator on specific row and column using the parent's ID which is 'row-x' based on row number.
    const nextRowElement = document.getElementById("row-".concat(row.toString()));
    const nextElement = nextRowElement.children.item(column);
    // Get the indicator from the parent row. 
    return nextElement.querySelector(".chess-board-indicator");
}

function ButtonSelect(button)
{
    // Check if the button is already selected, if not, remove all other selected buttons before selecting.
    if (!button.classList.contains("selected"))
        document.querySelectorAll(".selected").forEach(s => s.classList.remove("selected"));
    button.classList.toggle("selected");
}

function OnPawnClick(button)
{
    ButtonSelect(button);
    
    // Get current position from class list.
    let currentRow = parseInt(button.classList[0][0]);
    let currentColumn = parseInt(button.classList[0][1]);
    console.log(button.classList[0]);

    // Check if current row is valid to add on. 
    if (currentRow < 8)
    {
        currentRow++;
    }

    GetIndicator(currentRow, currentColumn).classList.toggle("active");

    // Since we know that the limit is the end and the pawn would have had to definitely move first, we do not need
    // to check whether the current row + 1 is correct for this specific case 
    if (!pawnHasMoved)
    {
        GetIndicator(currentRow + 1, currentColumn).classList.toggle("active");
    }
}

function OnIndicatorClick(indicator)
{
    // If there are no selected pieces (this should never be called in the first place) return early.
    const pieces = document.querySelectorAll(".selected");
    if (pieces.length == 0)
    {
        return;
    }

    // Get the row and column of the indicator based on its position in the parent.
    const row = indicator.parentElement.parentElement.id.slice(4); // The parent ID is 'row-x' so we just want x
    const rowElement = indicator.parentElement.parentElement;
    const column = Array.prototype.indexOf.call(rowElement.children, indicator.parentElement);

    const piece = pieces[0]; 

    // If it is a pawn, the first move should be set.
    if (!pawnHasMoved && piece.classList.contains("chess-board-pawn"))
    {
        pawnHasMoved = true;
    }

    indicator.parentElement.appendChild(piece);

    // Get all the new selected pieces and unselect them
    const piecesAfter = document.querySelectorAll(".selected");
    if (piecesAfter != null && piecesAfter.length > 0)
    {
        piecesAfter[0].classList.remove("selected");
    }
    // Get all the active indicators and make them not active by removing their active class
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

    // Add the new numbers to the front of the array using unshift and put them back into the class list.
    var newClassList = Array.from(piece.classList);
    newClassList.unshift(row + column.toString());
    piece.className = "";
    for (let i = 0; i < newClassList.length; ++i)
    {
        piece.classList.add(newClassList[i]);
    }


}


const quizResult = document.getElementById("quiz-result");

// Function to check and set the result of the quiz.
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
        // If none of the elements are checked, return early so nothing happens.
        if (!italian.checked && !french.checked) return;
        quizResult.textContent = "You are wrong!";
        quizResult.style.color = "var(--red)";
    }
}


window.addEventListener("scroll", Reveal);

// Update reveal on load.
Reveal();

// Update chessboard on load.
UpdateChessBoardOnSelect();








