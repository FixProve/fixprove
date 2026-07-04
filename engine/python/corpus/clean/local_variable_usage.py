class Widget:
    def render(self):
        return "ok"

w = Widget()
w.render()

def make_thing():
    class Inner:
        def go(self):
            pass
    return Inner()

t = make_thing()
t.go()
