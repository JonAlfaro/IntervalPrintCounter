**Q1) You have a new requirement to implement for your application: its logic should stay exactly the same but it will need to have a different user interface (e.g. if you wrote a web app, a different UI may be a REPL). Please describe how you would go about implementing this new UI in your application? Would you need to restructure your solution in any way?**

A) There was no need to restructure the solution; I wanted the functional logic to be separate from the UI so that it could be deployed as its own service. Due to the simplicity of this service, this logic could have existed in the UI alone, however, due to the unknown of what exactly would be using this service in the future I decided against this. 

If I did the entire solution on the frontend, to begin with, I would have had to migrate part of this logic (As much as I could) to its own backend and would have to write all the supporting client logic for communications.


**Q2) You now need to make your application “production ready”, and deploy it so that it can be used by customers. Please describe the steps you’d need to take for this to happen?**

A) First I would split each project into their own repositories, since the current structure was to just have all parts of the solution in one place.

Then some more testing would be good, currently, the api is the only one with some tests, but setting up an environment that could automatically do proper end-to-end testing would be fantastic. 

Then I would containerize the backend api service. The interval api service is simple and specialized in its feature set. Containerizing it gives us the benefit to choose whether we want to run it cluster'd using some orchestration tool or run it serverless. Not only this but having the service readily available as a container reduces the friction when a dev or client wants to integrate this service locally, and speeds up release time. 

After this, the automatisation of building the CLI interface needs to be done, with a readily available built binary for each operation system/chipset combination. These binaries can be distributed by a company website or just through GitHub releases.

Once the api service is deployed, the UI should be updated to automatically build and be distributed by a CDN like Cloudflare. The api service documentation should also be updated around this point and should be hosted somewhere more accessible than a GitHub repo.

Lastly, the UI should be updated to give better feedback on the initial connection click. Currently, everything is running locally, but if someone with slow internet tries to interact using the UI in production the feedback when waiting to connect to the web socket might lead them to think it's broken. This problem is amplified even more if a serverless approach is taken with the api service due to the potential of cold-starts.



**Q3) What did you think about this coding test - is there anything you’d suggest in order to improve it?**

A) I think this problem as a coding test is good. Its requirements were written a bit strange (which is good), but it was all understandable. It covers a lot of topics and makes you think about the production and ci/cd side of things. I wouldn't make it more complex, but it might be good to ask why they choose a particular UI approach. This allows the participant the be able to display their knowledge of why one approach might be better than the other, while also giving some information about their strengths in a particular skill/lack of knowledge on alternative skills.