@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-4 mb-sm-2">
                <div class="card">
                    <div class="card-header">Active Users</div>
                    <div id="active-users" class="card-body">

                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Chat <span id="typer" class="ml-2"></span></div>

                    <div class="card-body">
                        @if (session('status'))
                            <div class="alert alert-success" role="alert">
                                {{ session('status') }}
                            </div>
                        @endif

                        <div class="row justify-content-center">
                            <div id="message-container" class="col-12 message-container">
                                <div id="messages" class="mt-2 d-flex flex-column">

                                </div>
                            </div>
                            <form id="send-message">
                                <div class="col-12">
                                    <input id="message" type="text" class="form-control">
                                </div>
                                <div class="col-12 text-center mt-2">
                                    <button type="submit" class="btn btn-primary">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    @vite('resources/js/app.js')
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        window.me = {{ Auth::user()->id }};
        $(document).on('submit', '#send-message', function(e) {
            e.preventDefault();
            const message = document.querySelector('#message').value;
            $('#message').val('');
            $('#messages').append('<div class="msg self mb-1">' + message + '</div>');
            const message_container = document.querySelector('#message-container');
            message_container.scrollTop = message_container.scrollHeight;
            $.ajax({
                url: '{{ route('send-message') }}',
                type: 'POST',
                data: {
                    message: message,
                    _token: '{{ csrf_token() }}'
                },
                success: function(data) {
                    // console.log(data);
                },
                error: function(data) {
                    console.error(data);
                }
            });
        });
    </script>
@endsection
