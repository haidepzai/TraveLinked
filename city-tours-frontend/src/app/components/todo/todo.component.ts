import { Component, Input, OnInit } from '@angular/core';
import { ToDo } from 'src/app/models/todo.model';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { TourService } from 'src/app/services/requestServices/tour.service';

@Component({
   selector: 'app-todo',
   templateUrl: './todo.component.html',
   styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
   @Input() todos: ToDo[] = [];
   @Input() isOwnTour: boolean;

   title: string;
   tourId: string;

   constructor(private route: ActivatedRoute, private snackBar: SnackBarService, private tourService: TourService) {}

   ngOnInit(): void {
      this.route.params.subscribe((params) => {
         this.tourId = params.tourid;
      });
   }

   addTodo(title: string): void {
      const toDo: ToDo = {
         id: uuidv4(),
         title: this.title,
         completed: false,
      };
      this.todos.push(toDo);
      this.saveTodo();
   }

   toggleTodoItem(todo: ToDo): void {
      // Toggle in UI
      todo.completed = !todo.completed;
      this.saveTodo();
   }

   deleteTodoItem(todo: ToDo): void {
      this.todos = this.todos.filter((t) => t.id !== todo.id); // delete from UI
      this.saveTodo();
   }

   // Set Dynamic Classes
   setClasses(todo: ToDo): object {
      const classes = {
         'is-complete': todo.completed,
      };
      return classes;
   }

   saveTodo(): void {
      this.tourService.saveTodos(this.tourId, this.todos).subscribe(
         (data) => {
            this.snackBar.showSnackBar('Todo successfully added', 3000, 'snackbar-success');
         },
         (error) => {
            console.log(error);
            this.snackBar.showSnackBar('Todo could not be added', 3000, 'snackbar-error');
         }
      );
   }
}
