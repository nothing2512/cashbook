# Cashbook apps

## Features
- Dashboard
- Transaction management (including income, expenses, debt, receivables)
- category manegement
- saving account management

## How to deploy it for free

#### Servers : 
- [Vercel](http://vercel.com/)
- [Supabase](https://supabase.com/)

#### Steps 1 (Github) :
- Fork/clone this repository into your github account

#### Steps 2 (Supabase) :
- Create supabase account.
- Create supabase authentication users. [see instruction here](https://chatgpt.com/share/69ee0a13-1f64-83a1-baa6-91deca2f455d)
- enable pg_cron in supabase. [see instruction here](https://chatgpt.com/share/69f5fb03-9ef8-8323-8490-49e5f0bbb80c)
- migrate database in supabase from `migrations.sql` file. [see instruction here](https://chatgpt.com/share/69ee0b26-85bc-83a1-bb64-13fd53652bc9)

#### Steps 3 (vercel) :
- Create vercel account.
- Find your supabase api keys in Supabase dashboard > Project Settings > API Keys -> Publishable Key (note: this key will be used as env `SUPABASE_API_KEY`)
- Find your supabase url in Supabase dashboard > Project Overview > Copy > Copy Project URL (note: this url will be used as env `SUPABASE_URL` with format `<your-supabase-project-url>/rest/v1`)
- Deploy your apps into vercel account. [see instruction here](https://chatgpt.com/share/69ee0e69-fd4c-8322-ac8d-7e0c01b204f4)


## LICENSE
```
MIT License

Copyright (c) 2026 Samtebor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```