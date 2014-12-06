function index(request, reply) {
  reply.view('index.html', { title: 'Woot' });
}

exports.index = index;