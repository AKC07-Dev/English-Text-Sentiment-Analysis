// This function is called when the "Analyze" button is clicked
function analyzeReview() {
    // 1. Get the review text from the textarea
    const reviewText = document.getElementById('reviewInput').value;
    
    // 2. Check if the review is empty
    if (reviewText.trim() === '') {
        document.getElementById('result').innerText = 'Please enter a review.';
        return;
    }

    // 3. Prepare the data to be sent to the API
    const data = {
        review: reviewText
    };

    // 4. Send a POST request to your Python API
    fetch('http://localhost:5000/predict_sentiment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        // 5. Display the sentiment prediction
        const sentiment = data.sentiment;
        const resultElement = document.getElementById('result');
        
        if (sentiment) {
            resultElement.innerText = 'Sentiment: ' + sentiment.toUpperCase();
            
            // Optional: Change color based on sentiment
            if (sentiment === 'good') {
                resultElement.style.color = 'green';
            } else if (sentiment === 'bad') {
                resultElement.style.color = 'red';
            } else {
                resultElement.style.color = 'orange';
            }
        } else {
            resultElement.innerText = 'Could not get sentiment.';
        }
    })
    .catch(error => {
        // Handle any errors that occur during the fetch
        console.error('There was an error:', error);
        document.getElementById('result').innerText = 'Error: Unable to connect to the sentiment analyzer.';
    });
}