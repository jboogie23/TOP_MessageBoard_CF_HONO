import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

let messages = [
	{
	  id: 1,
	  text: "Hi there!",
	  user: "Amando",
	  added: new Date()
	},
	{
	  id: 2,
	  text: "Hello World!",
	  user: "Charles",
	  added: new Date()
	}
  ];
  
  let nextId = 3;
  
  app.get('/', (c) => {
	return c.html(
	  html`
		<!DOCTYPE html>
		<html>
		  <head>
			<title>Message Board</title>
			<style>
			  body { font-family: Arial, sans-serif; }
			  .message { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
			  .user { font-weight: bold; }
			  .date { color: #888; font-size: 0.8em; }
			</style>
		  </head>
		  <body>
			<h1>Message Board</h1>
			<a href="/new">Post a new message</a>
			${messages.map(message => html`
			  <div class="message">
				<p class="user">${message.user}</p>
				<p>${message.text.substring(0, 50)}${message.text.length > 50 ? '...' : ''}</p>
				<p class="date">${message.added.toLocaleString()}</p>
				<a href="/message/${message.id}">View full message</a>
			  </div>
			`)}
		  </body>
		</html>
	  `
	)
  })

// GET Page to post new message
app.get('/new', (c) => {
  return c.html(
    html`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Post New Message</title>
          <style>
            body { font-family: Arial, sans-serif; }
            form { margin-top: 20px; }
            input, textarea { display: block; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Post New Message</h1>
          <form action="/new" method="POST">
            <input type="text" name="user" placeholder="Your Name" required>
            <textarea name="text" placeholder="Your Message" required></textarea>
            <input type="submit" value="Post Message">
          </form>
          <a href="/">Back to Message Board</a>
        </body>
      </html>
    `
  )
})
  
// POST New Message
app.post('/new', async (c) => {
	const { user, text } = await c.req.parseBody()
	
	if (user && text) {
	  messages.push({
		id: nextId++,
		text,
		user,
		added: new Date()
	  })
	}
	
	return c.redirect('/')
  })

// GET The message in detail
app.get('/message/:id', (c) => {
	const id = parseInt(c.req.param('id'))
	const message = messages.find(m => m.id === id)
  
	if (!message) {
	  return c.notFound()
	}
  
	return c.html(
	  html`
		<!DOCTYPE html>
		<html>
		  <head>
			<title>Full Message</title>
			<style>
			  body { font-family: Arial, sans-serif; }
			  .message { border: 1px solid #ddd; padding: 20px; margin-top: 20px; }
			  .user { font-weight: bold; }
			  .date { color: #888; font-size: 0.8em; }
			</style>
		  </head>
		  <body>
			<h1>Full Message</h1>
			<div class="message">
			  <p class="user">${message.user}</p>
			  <p>${message.text}</p>
			  <p class="date">${message.added.toLocaleString()}</p>
			</div>
			<a href="/">Back to Message Board</a>
		  </body>
		</html>
	  `
	)
  })


export default app