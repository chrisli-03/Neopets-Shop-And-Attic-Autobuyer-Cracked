const emailURL = "https://raw.githubusercontent.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/main/Autobuyer/src/options/Mail/MailDocument.html"; // Replace with the URL you want to ping

class Email {
    constructor(Entry, ID, Author, Date, Subject, Contents){
        this.Entry = Entry;
        this.ID = ID;
        this.Author = Author;
        this.Date = Date;
        this.Subject = Subject;
        this.Contents = Contents;
    }
}

function getEMAIL_LIST(callback) {
    chrome.storage.local.get(['EMAIL_LIST'], function (result) {
        var value = result.EMAIL_LIST;

        if(value == undefined) value = [];

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setEMAIL_LIST(value) {
    chrome.storage.local.set({ EMAIL_LIST: value }, function () {});
}

fetch(emailURL)
  .then(response => response.text())
  .then(htmlContent => {
    const parser = new DOMParser();
    const githubDocument = parser.parseFromString(htmlContent, 'text/html');

    // 'html' contains the HTML content of the site
    console.log(htmlContent);

    var ID = githubDocument.getElementById("id").textContent;
    var author = githubDocument.getElementById("author").textContent;
    var date = githubDocument.getElementById("date").textContent;
    var subject = githubDocument.getElementById("subject").textContent;
    var contents = githubDocument.getElementById("contents").textContent;

    var extractedEmail = new Email(0, ID, author, date, subject, contents);

    getEMAIL_LIST(function (emailList){
        console.log(emailList);

        for(var i = 0; i < emailList.length; i++){
            var email = emailList[i];
            email.Entry = i + 1;
            InsertNewEmailRow(email);
        }

        const hasEmail = [...emailList].some(email => email.ID == ID);

        if(hasEmail){
            return;
        }

        emailList.unshift(extractedEmail);
        setEMAIL_LIST(emailList);
    });

    var loading = document.getElementById("loading-messages");
    loading.style.visibility = "hidden";

}).catch(error => {
    console.error("An error ocurred during the execution... Try again later...", error);
});

var inbox = document.getElementById("inbox");
var activeEmail= null;

function InsertNewEmailRow(email){
    var newEmailRow = inbox.insertRow();

    var emailEntryCell = newEmailRow.insertCell(0);
    emailEntryCell.textContent = email.Entry;

    var emailAuthorCell = newEmailRow.insertCell(1);
    emailAuthorCell.textContent = email.Author;

    var emailDateCell = newEmailRow.insertCell(2);
    emailDateCell.textContent = email.Date;

    var emailSubjectCell = newEmailRow.insertCell(3);
    emailSubjectCell.textContent = email.Subject;

    var emailReadCell = newEmailRow.insertCell(4);

    // Adding the envelope icon;
    var aElement = document.createElement('a');
    var imgElement = document.createElement('img');
    imgElement.src = "../../toolbar/neomail.svg";
    imgElement.classList.add("mail-inbox");

    aElement.appendChild(imgElement);
    emailReadCell.appendChild(aElement);
    emailReadCell.style.cursor = "pointer";

    emailReadCell.addEventListener("click", function(event){
        var cellIndex = Number(newEmailRow.querySelector("td:first-child").textContent);

        getEMAIL_LIST(function (emailList){
            activeEmail = emailList[cellIndex - 1];

            inbox.style.visibility = "hidden";
            messageContainer.style.visibility = "visible";
            returnToInboxButton.style.visibility = "visible";
            messageContainer.textContent = activeEmail.Contents;
        });
    });

    inbox.appendChild(newEmailRow);
}

var messageContainer = document.getElementById("message");
messageContainer.style.visibility = "hidden";

var returnToInboxButton = document.getElementById("return-to-inbox");

returnToInboxButton.addEventListener("click", ShowInbox);

ShowInbox();

function ShowInbox(){
    messageContainer.style.visibility = "hidden";
    messageContainer.textContent = "";
    inbox.style.visibility = "visible";
    returnToInboxButton.style.visibility = "hidden";
}

var deleteEmailsButton = document.getElementById("reset");
deleteEmailsButton.addEventListener("click", DeleteMails);

function DeleteMails(){
    setEMAIL_LIST([]);
    window.alert("All NeoBuyer+ mails have been successfully deleted!");
    window.location.reload();
}