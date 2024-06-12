
let ctx;
let canvas;
let w = 512;
let field;





class Field{
    constructor(ctx){
        this.ctx = ctx
        this.margin = w / 3;
        this.cell = (w * 2 - this.margin * 2) / 3;
        this.t_margin = 30
        this.r = 20
        this.color = [
            'black',
            'white',
            'red'
        ]
        
        this.ctx.fillStyle = this.color[1]
        this.ctx.strokeStyle = this.color[1]
        this.init_all()
       
        this.animate()
    }
    init_all(){
        this.power = [];
        this.speed = document.getElementById('speed').value;
        this.team_1 = [
            document.getElementById('t_0_0').value, 
            document.getElementById('t_0_1').value, 
            document.getElementById('t_0_2').value];
        this.team_2 = [
            document.getElementById('t_1_0').value, 
            document.getElementById('t_1_1').value, 
            document.getElementById('t_1_2').value];
        this.players = [];
        this.score = [0, 0]
        this.ball = {
            seg_0: 1,
            seg_1: 1,
            team_0: 0,
            team_1: 0,
            player_0: 5,
            player_1: 5,
            x: 0,
            y: 0
        };
        this.time = 0
        this.init_players()
        this.calculate_power()
    }
   
    calculate_power(){
        for (let i = 0; i < 3; i++) {
            let k
            if (this.team_1[i] == this.team_2[i]) k = .5
            if (this.team_1[i] > this.team_2[i]) k = parseFloat(this.team_2[i]) / parseFloat(this.team_1[i])
            if (this.team_1[i] < this.team_2[i]) k = 1 - parseFloat(this.team_1[i]) / parseFloat(this.team_2[i])
            
            this.power.push(
                k
            )
        }
        
    }

    animate(){
        requestAnimationFrame(()=>{
            this.animate()
            this.time++
        })
        if(this.time % this.speed==0)
        {
            this.logic()
        }
        let l = this.players[0].length
        for (let i = 0; i < l; i++) {
            this.players[0][i].x += Math.cos(this.time / 200 + i /l * 7) / 10
            this.players[1][i].x += Math.cos(this.time / 130 + i /l * 5) / 10
            this.players[0][i].y += Math.cos(this.time / 210 + i /l * 3) / 10
            this.players[1][i].y += Math.cos(this.time / 150 + i /l * 5) / 10
        }

        this.draw()
    }
    logic(){
        let team
        let power = this.power[this.ball.seg_1]

        if(parseFloat(this.ball.player_1) == 11){
           
            team = this.ball.team_1
        } else {    
            team = Math.random()
            if(power == undefined) power = .5;
            team = (team >= power)?0:1
        }
        

        let nearest = []
        for (let i = 0; i < this.players[team].length; i++) {
            let player = this.players[team][i]
            
            if(player.seg == this.ball.seg_1)nearest.push(player)
            if(player.seg == this.ball.seg_1 - 1)nearest.push(player)
            if(player.seg == this.ball.seg_1 + 1)nearest.push(player)
            
        }

        let index = Math.round(
            Math.random() * (nearest.length - 1)
        )
        let player = nearest[index].num 

        let goal = 0
        let mute = 0
        if(player == this.players[0].length - 1){
            goal = 1
        }
        if(this.ball.player_1 == this.players[0].length - 1){
            mute = 1
        }

        let team_txt = [
            'левого',
            'правого'
        ]


        if(team != this.ball.team_1){
            if(player == this.players[0].length - 1){
                console.log('Бьет '+ this.ball.player_1 + ' ' + team_txt[team] +'!' )
            } else {
                console.log('Перехват от' + ' '+ this.ball.player_1 + ', мяч теперь у ' + player + ' ' + team_txt[team])
            }
        } else{
            if(goal == 1 && mute == 0){
                console.log('Aтака от ' + team_txt[team] + ' '+ this.ball.player_1)
                
            } else {
                if (mute == 0)console.log('Пас от ' + team_txt[team] + ' '+ this.ball.player_1 + ' к ' + player)
            }
        } 
      

        this.ball.seg_0 = this.ball.seg_1   
        this.ball.player_0 = this.ball.player_1
        this.ball.team_0 = this.ball.team_1
        this.ball.player_1 = player
        this.ball.team_1 = team
        this.ball.seg_1 = nearest[index].seg

        if(this.ball.player_0 == this.players[0].length - 1){
            console.log('GOAL!')
            if(this.ball.team_0 == 0)this.score[0]++
            if(this.ball.team_0 == 1)this.score[1]++
            this.ball = {
                seg_0: 1,
                seg_1: 1,
                team_0: 0,
                team_1: 0,
                player_0: 5,
                player_1: 5,
                x: 0,
                y: 0
            };
        }
    }



    init_players(){
        let team_1 = []
        let team_2 = []
        let d = 2;
        for (let i = 0; i < 3; i++) {
            let x = this.margin + this.cell * i;
            
            for (let j = 0; j < this.team_1[i]; j++) {
                let player = {
                    num: team_1.length,
                    seg: i,
                    x : x + this.cell / 2 - this.r, 
                    y : w / 2  - (this.team_1[i]- 1) / 2 * this.r * d + j * this.r * d, 
                    color : false
                }
                team_1.push(player)
            }  
            for (let j = 0; j < this.team_2[i]; j++) {
                let player = {
                    num: team_2.length,
                    seg: i,
                    x : x + this.cell / 2 + this.r, 
                    y : w / 2  - (this.team_2[i]- 1) / 2 * this.r * d + j * this.r * d, 
                    color : true
                }
                team_2.push(player)
                
            }         
        }
        team_1.push({
            num: team_1.length,
            seg: -1,
            x: this.margin / 2, 
            y: w / 2, 
            color: false
        })
        team_2.push({
            num: team_2.length,
            seg: 3,
            x: w * 2 - this.margin / 2, 
            y: w / 2, 
            color: true
        })

        team_1.push({
            num: team_1.length,
            seg: 3,
            x: w * 2 - this.margin / 2 + d * this.r, 
            y: w / 2, 
            color: true
        })
        team_2.push({
            num: team_2.length,
            seg: -1,
            x: this.margin / 2 - d * this.r, 
            y: w / 2, 
            color: false
        })
        
        this.players.push(team_1)
        this.players.push(team_2)
       
    }
    draw(){
        this.clear_canvas()
        this.draw_field()
        this.draw_players()
        this.draw_ball()
        this.draw_gates()
    }
    draw_ball(){
        this.ctx.fillStyle = 'red'
        let progress = this.time % this.speed / this.speed
       
        let player_0 = this.players[this.ball.team_0][this.ball.player_0]
        let x_0 = player_0.x
        let y_0 = player_0.y
        
        let player_1 = this.players[this.ball.team_1][this.ball.player_1]
        let x_1 = player_1.x
        let y_1 = player_1.y
        
        let a = Math.atan2(y_1 - y_0, x_1 - x_0);
        let d = Math.sqrt(
            Math.pow(y_1 - y_0, 2) + Math.pow(x_1 - x_0, 2)
        )
        let l = d * progress
        if(Number.isNaN(l)) l = 0
        let x = x_0 + Math.cos(a) * l
        let y = y_0 + Math.sin(a) * l
        this.circle(
            x,
            y,
            this.r / 2,
            true
        )
        this.ctx.fillStyle = 'black'
    }
    clear_canvas(){
        this.ctx.fillStyle = this.color[0]
        this.ctx.fillRect(
            0, 0,
            w * 2, w, 
        )
        this.ctx.fillStyle = this.color[1]
    }
   
    draw_field(){
        this.ctx.fillStyle = this.color[1]
        for (let i = 0; i < 4; i++) {
            let x = this.margin + this.cell * i;
            this.line(x, 0 , x, w)
            if(i < 3){
                this.ctx.fillText(
                    this.team_1[i],
                    x + this.t_margin,
                    this.t_margin 
                )
                this.ctx.fillText(
                    this.team_2[i],
                    x + this.cell - this.t_margin,
                    w - this.t_margin 
                )
            }
        }
        this.ctx.fillText(
            this.score[0] + ':' + this.score[1],
            this.margin / 2,
            this.t_margin 
        )
        let min = Math.round(this.time / this.speed) 
        let hr = Math.round(min / 60)
        min %= 60;
        if(min<10) min = '0' + min
        if(hr<10) hr = '0' + hr
        this.ctx.fillText(
            hr + ':' + min,
            w * 2 - this.margin / 2,
            this.t_margin 
        )
    }
    draw_players(){
        for (let i = 0; i < this.players[0].length - 1; i++) {
            ctx.fillStyle = this.color[1]
            let player_1 = this.players[0][i]
            let player_2 = this.players[1][i]
            this.circle(
                player_1.x,
                player_1.y,
                this.r,
                player_1.color
            )
            this.circle(
                player_2.x,
                player_2.y,
                this.r,
                player_2.color
            )
            ctx.font = "20px Arial"
            ctx.fillText(
                player_1.num,
                player_1.x,
                player_1.y
            )
            ctx.fillStyle = this.color[0]
            ctx.fillText(
                player_2.num,
                player_2.x,
                player_2.y
            )
            
        }
        ctx.font = "40px Arial"
    }
    draw_gates(){
        this.line(
            this.margin / 2 - this.r * 2,
            w / 2 - this.r * 4, 
            this.margin / 2,
            w / 2 - this.r * 4, 
        )
        this.line(
            this.margin / 2 - this.r * 2,
            w / 2 + this.r * 4, 
            this.margin / 2,
            w / 2 + this.r * 4, 
        )
        this.line(
            this.margin / 2 - this.r * 2,
            w / 2 + this.r * 4, 
            this.margin / 2 - this.r * 2,
            w / 2 - this.r * 4, 
        )


        this.line(
            w * 2 - this.margin / 2 + this.r * 2,
            w / 2 - this.r * 4, 
            w * 2 - this.margin / 2,
            w / 2 - this.r * 4, 
        )
        this.line(
            w * 2 - this.margin / 2 + this.r * 2,
            w / 2 + this.r * 4, 
            w * 2 - this.margin / 2,
            w / 2 + this.r * 4, 
        )
        this.line(
            w * 2 - this.margin / 2 + this.r * 2,
            w / 2 + this.r * 4, 
            w * 2 - this.margin / 2 + this.r * 2,
            w / 2 - this.r * 4, 
        )
    }
    circle(x, y , r, fill){
        
        this.ctx.beginPath()
        this.ctx.arc(
            x, 
            y, 
            r, 0, Math.PI * 2
        )
        this.ctx.closePath()
        this.ctx.stroke()
        if(fill)this.ctx.fill()
    }
    line(x_0, y_0,x_1, y_1){
        this.ctx.beginPath()
        this.ctx.moveTo(
            x_0, y_0
        )
        this.ctx.lineTo(
            x_1, y_1
        )
        this.ctx.closePath()
        this.ctx.stroke()
    }

}




canvas = document.createElement('canvas');
canvas.width = w * 2;
canvas.height = w;
ctx = canvas.getContext('2d');
document.body.insertBefore(
    canvas, 
    document.getElementById('layout')
)
ctx.font = "40px Arial"
ctx.textAlign = "center"
ctx.textBaseline= "middle"

field = new Field(ctx);

document.getElementById('submit_button').onclick = ()=>{
    field.init_all()
}