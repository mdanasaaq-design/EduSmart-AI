"""
EduSmart AI - Random Forest training pipeline.
The demo dataset is synthetic so the prototype can run without external data.
Replace load_demo_data() with a real anonymized institute dataset for research use.
"""
import json
from pathlib import Path
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

FEATURES=["attendance","averageMarks","recentTrend","missedAssessments"]
CLASSES=["Low","Medium","High"]

def load_demo_data(n=1200, seed=42):
    rng=np.random.default_rng(seed)
    attendance=rng.uniform(45,100,n)
    marks=rng.uniform(30,100,n)
    trend=rng.uniform(-30,20,n)
    missed=rng.integers(0,8,n)
    score=.045*attendance+.035*marks+.05*trend-.7*missed
    y=np.where(score<3.0,2,np.where(score<4.3,1,0))
    return np.c_[attendance,marks,trend,missed],y

def tree_to_json(estimator):
    t=estimator.tree_
    def walk(i):
        if t.children_left[i] == -1:
            return {"leaf": int(np.argmax(t.value[i][0]))}
        return {"feature":int(t.feature[i]),"threshold":float(t.threshold[i]),
                "left":walk(t.children_left[i]),"right":walk(t.children_right[i])}
    return walk(0)

X,y=load_demo_data()
X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=.20,random_state=42,stratify=y)
model=RandomForestClassifier(n_estimators=40,max_depth=6,min_samples_leaf=4,random_state=42)
model.fit(X_train,y_train)
pred=model.predict(X_test)
print(f"Validation accuracy: {accuracy_score(y_test,pred):.4f}")
print(classification_report(y_test,pred,target_names=CLASSES))

artifact={"features":FEATURES,"classes":CLASSES,
          "trees":[tree_to_json(e) for e in model.estimators_]}
out=Path(__file__).with_name("model.json")
out.write_text(json.dumps(artifact,separators=(",",":")))
print(f"Wrote {out}")
