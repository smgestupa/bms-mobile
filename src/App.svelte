<script>
  import { Route } from "tinro";
  import { Toaster } from "svelte-french-toast";
  import Nav from "$components/nav/Nav.svelte";
  import Splash from "$pages/Splash.svelte";
  import Login from "$pages/Login.svelte";
  import Register from "$pages/Register.svelte";
  import Dashboard from "$pages/Dashboard.svelte";
  import Scan from "$pages/Scan.svelte";
  import Profile from "$pages/Profile.svelte";
  import Search from "$pages/Search.svelte";
  import Book from "$pages/Book.svelte";
</script>

<!-- <nav style="position: absolute">
  <a href="/book/5">Book</a>
</nav> -->

<Toaster />

<Route path="/">
  <Splash />
</Route>

<Route path="/register">
  <Register />
</Route>

<Route path="/login">
  <Login />
</Route>

<Route path="/dashboard/*">
  <Route path="/">
    <Dashboard />
  </Route>
  <Route path="/scan">
    <Scan />
  </Route>
  <Route path="/profile">
    <Profile />
  </Route>
  <Nav />
</Route>

<Route path="/search" let:meta>
  <Search search={ meta.query.t } />
</Route>

<Route path="/book/:id" let:meta>
  <Book id={ meta.params.id } />
</Route>